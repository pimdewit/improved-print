/**
 * ImprovedPrint is a 'leaf' custom-element. It's sole purpose is to
 *    encapsulate HTML, strip out the links within the content, and make a
 *    nice list of footnotes when attempting to print.
 */
class ImprovedPrint extends HTMLElement {
  /**
   * Create an AnchorElement and encapsulate it within an list item.
   * @param {HTMLAnchorElement.href|string} href
   * @return {HTMLLIElement}
   * @private
   */
  static _createFootnoteItem(href) {
    const listItem = /** @type {HTMLLIElement} */ (document.createElement('li'));
    const a = /** @type {HTMLAnchorElement} */ (document.createElement('a'));

    a.href = href;
    a.innerText = href;

    listItem.appendChild(a);

    return listItem;
  }


  /**
   * Create the template.
   * @return {HTMLTemplateElement}
   */
  static template() {
    const element = /** @type {HTMLTemplateElement} */ (document.createElement('template'));

    element.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        :host([hidden]) {
          display: none;
        }
      </style>
      <slot></slot>
    `;

    return element;
  }


  /** @constructs {ImprovedPrint} */
  constructor() {
    super();

    /**
     * Class that gets appended on print. This class is mainly used as a
     *    selector. That way we can easily manage which elements need to get
     *    removed when the user is done with the printing prompt.
     * @type {string}
     * @private
     */
    this._printOnlyClass = 'improved-print__print-only';

    /**
     * @type {ShadowRoot}
     * @private
     * @see {@link https://mzl.la/2Tlfgsl|MDN - ShadowRoot}
     */
    this._shadowRoot = this.attachShadow({mode: 'open'});

    /**
     * @type {MediaQueryList}
     * @private
     * @see {@link https://mzl.la/2TmaXg9|MDN - MediaQueryList}
     */
    this._printMediaObserver = window.matchMedia('print');

    const template = ImprovedPrint.template();

    // Append elements to our ShadowDOM.
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.__onPrint = this._onPrint.bind(this);

    this._addListeners();
  }


  /** @private */
  _addListeners() {
    this._printMediaObserver.addListener(this.__onPrint);
  }


  /**
   * On print handler.
   * @param {MediaQueryListEvent} event
   * @private
   */
  _onPrint(event) {
    const isAboutToPrint = event.matches;
    isAboutToPrint ? this._handleDOM() : this._removeDOM();
  }


  /**
   * Create and append additional <sup> elements to serve as notifiers within the original links.
   * @private
   */
  _handleDOM() {
    const linksFromSlottedContent = this.originalLinks;

    if (!linksFromSlottedContent) {
      // Stop the process if no links could be found within the "light dom".
      return;
    }

    // Wrap the footnotes in a <nav> for semantic reasons.
    const nav = document.createElement('nav');
    nav.className = `${this._printOnlyClass}`;

    // Will contain all the footnotes & citations.
    const footnoteContainer = document.createElement('ol');
    footnoteContainer.setAttribute('role', 'list');

    nav.appendChild(footnoteContainer);
    this._shadowRoot.appendChild(nav);

    this._createDOM(footnoteContainer, linksFromSlottedContent);
  }


  /**
   * Add numbers/identifiers to all AnchorElements with [href] in the slotted DOM.
   * @param {HTMLElement} footnoteContainer - The footnote/citation-item nodes
   *    will get appended to this element.
   * @param {NodeList<HTMLAnchorElement>} originalLinks - The original
   *    links' will get modified by adding an extra ChildNode to the DOM.
   * @private
   */
  _createDOM(footnoteContainer, originalLinks) {
    for (let linkIndex = 0; linkIndex < originalLinks.length; linkIndex += 1) {
      const link = originalLinks[linkIndex];

      // Create an element that contains the footnote info.
      const citationItem = ImprovedPrint._createFootnoteItem(link.href);
      // Append the footnote info to its container.
      footnoteContainer.appendChild(citationItem);

      this._addCitationIndexToInitialLink(link, linkIndex + 1);
    }
  }


  /**
   * Modify the initial anchor element (from the "light DOM") by adding a
   *    superscript element containing the citation index.
   * @param {HTMLAnchorElement} link
   * @param {number} index - The citation index.
   * @private
   */
  _addCitationIndexToInitialLink(link, index) {
    // Create a superscript element to serve as an identifier.
    const supElement = document.createElement('sup');
    supElement.innerText = `${index}`;
    supElement.classList.add(this._printOnlyClass);

    link.appendChild(supElement);
  }


  /**
   * Get the links that were initially given by the slotted content.
   * @return {NodeList<HTMLAnchorElement>}
   * @private
   */
  get originalLinks() {
    return this.querySelectorAll('a[href]');
  }


  /**
   * Remove all the generated DOM by looping through classes.
   * @private
   */
  _removeDOM() {
    const selector = `.${this._printOnlyClass}`;
    const lightDOMElements = this.querySelectorAll(selector);
    const shadowDOMElements = this._shadowRoot.querySelectorAll(selector);
    let elements = [...lightDOMElements, ...shadowDOMElements];

    // Reverse loop for perf.
    for (let i = elements.length - 1; i >= 0; i--) {
      elements[i].remove();
      elements[i] = null;
    }
  }


  /** @private */
  _removeEventListeners() {
    this._printMediaObserver.removeListener(this.__onPrint);
  }


  /**
   * Dispose the DOM, event-listeners and observers related to this instance.
   */
  disconnectedCallback() {
    this._removeDOM();
    this._removeEventListeners();

    this._printMediaObserver = null;
    this.__onPrint = null;
    this.elements = null;
  }
}

window.customElements.define('improved-print', ImprovedPrint);
