const CSS_SELECTORS = {
  LINKS: `a[href]:not([data-no-improved-print])`,
  HIDDEN_CLASS: 'improved-print--hidden',
};


class ImprovedPrint extends HTMLElement {
  /**
   * Create the template. We are doing this programmatically because we don't
   *  want to obfuscate the DOM with an unused element (<template>).
   * @return {HTMLTemplateElement}
   */
  static template() {
    const element = /** @type {HTMLTemplateElement} */ (
        document.createElement('template'));

    element.innerHTML = `
      <style>
        :host {
          display: inherit;
        }
        :host([${CSS_SELECTORS.HIDDEN_CLASS}]) {
          display: none;
        }
        
        :host .${CSS_SELECTORS.HIDDEN_CLASS} {
          display: none;
        }
        
        @media print {
          :host .${CSS_SELECTORS.HIDDEN_CLASS},
          :host ::slotted(.${CSS_SELECTORS.HIDDEN_CLASS}) {
            display: inherit;
          }
        }
      </style>
      <slot></slot>
    `;

    return element;
  }

  /**
   * @return {{nav: HTMLElement, list: HTMLOListElement}}
   */
  static createNavigationalList() {
    const nav = /** @type {HTMLElement} */ (
        document.createElement('nav'));
    nav.classList.add(CSS_SELECTORS.HIDDEN_CLASS);

    const list = /** @type {HTMLOListElement} */ (
        document.createElement('ol'));
    /** @see {@link http://bit.ly/31yDhiy|Scott O'Hara}} */
    list.setAttribute('role', 'list');

    nav.appendChild(list);

    return {nav, list};
  }

  /**
   * Create an AnchorElement and encapsulate it within an list item.
   * @param {string} href
   * @return {HTMLLIElement}
   * @private
   */
  static createFootnote(href) {
    const listItem = /** @type {HTMLLIElement} */ (
        document.createElement('li'));
    const a = /** @type {HTMLAnchorElement} */ (document.createElement('a'));

    a.href = href;
    a.textContent = href;

    listItem.appendChild(a);

    return listItem;
  }


  constructor() {
    super();

    /**
     * @type {?ShadowRoot}
     */
    this._shadowRoot = null;

    /**
     * @type {NodeList<HTMLAnchorElement>}
     * @private
     */
    this._links = this._getLinks();

    /**
     * @type {?NodeList<HTMLElement>}
     * @private
     * @see ImprovedPrint._setup
     */
    this._supElements = null;

    /**
     * @type {MediaQueryList}
     * @private
     */
    this._printObserver = window.matchMedia('print');

    // Scope bindings.
    this._onPrint = this._onPrint.bind(this);
  }


  // Life cycle methods.

  connectedCallback() {
    if (this.isConnected) {
      this._setup();
      this._addEventListeners();
    }
  }

  disconnectedCallback() {
    if (!this.isConnected) {
      this._removeEventListeners();
    }
  }


  // Events

  /**
   * @private
   */
  _addEventListeners() {
    this._printObserver.addListener(this._onPrint);
  }

  /**
   * @private
   */
  _removeEventListeners() {
    this._printObserver.removeListener(this._onPrint);
  }

  /**
   * Triggers when the environment changes from screen to print.
   * @param {MediaQueryList} event
   * @private
   */
  _onPrint(event) {
    /**
     * Unfortunately we have to do this in order to prevent adding a new
     *    dependency which is out-of-scope styling.
     */
    if (event.matches) {
      this._supElements.forEach(element => element.hidden = false);
    } else {
      requestAnimationFrame(() => {
        // Wait a frame.
        this._supElements.forEach(element => element.hidden = true);
      });
    }
  }


  // Private API

  /**
   * Setup the main environment.
   * @private
   */
  _setup() {
    /** @type {DocumentFragment} */
    const content = ImprovedPrint.template().content;

    this._shadowRoot = this.attachShadow({mode: 'open'});
    this._shadowRoot.appendChild(content);

    this._generateDOM();
  }

  /**
   *
   * @param {HTMLOListElement} parent
   * @param {NodeList<HTMLAnchorElement>} links
   * @private
   */
  _createFootnotes(parent, links) {
    links.forEach((link, index) => {
      const citationItem = ImprovedPrint.createFootnote(link.href);

      // Create a superscript element to serve as an identifier.
      const supElement = document.createElement('sup');
      supElement.textContent = `${index + 1}`;
      supElement.classList.add(CSS_SELECTORS.HIDDEN_CLASS);
      supElement.inert = true;
      supElement.hidden = true;
      supElement.setAttribute('aria-hidden', 'true');

      link.appendChild(supElement);

      parent.appendChild(citationItem);
    });

    this._supElements = this._getSupElements();
  }

  /**
   * Generate all necessary DOM.
   * @private
   */
  _generateDOM() {
    if (!this.links) return;

    const {nav, list} = ImprovedPrint.createNavigationalList();
    nav.classList.add(CSS_SELECTORS.HIDDEN_CLASS);
    nav.inert = true;
    nav.setAttribute('aria-hidden', 'true');

    this._createFootnotes(list, this.links);
    this._shadowRoot.appendChild(nav);
  }

  /**
   * Get all links encapsulated in the LIGHT DOM of this component.
   * @private
   * @return {NodeList<HTMLAnchorElement>}
   */
  _getLinks() {
    return /** @type {NodeList<HTMLAnchorElement>} */ (
        this.querySelectorAll(CSS_SELECTORS.LINKS));
  }

  /**
   * Get all <sup> elements that have been dynamically appended to the
   *  LIGHT DOM.
   * @return {?NodeList<?HTMLElement>}
   * @private
   */
  _getSupElements() {
    return /** @type {?NodeList<?HTMLElement>} */ (
        this.querySelectorAll(`sup.${CSS_SELECTORS.HIDDEN_CLASS}`));
  }


  /**
   * All links encapsulated in this component's LIGHT DOM.
   * @return {NodeList<HTMLAnchorElement>}
   */
  get links() {
    return this._links;
  }
}


window.customElements.define('improved-print', ImprovedPrint);
