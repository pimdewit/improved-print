[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/pimdewit/improved-print)

# Improved Print

<improved-print> is a 'leaf' custom-element. It's sole purpose is to encapsulate HTML, strip out the links within the content, and make a nice list of footnotes when attempting to print.

This web component is based on an A List Apart article from 2005(!), written by [@AaronGustafson](https://twitter.com/AaronGustafson).

Visit the original article: [https://alistapart.com/article/improvingprint](https://alistapart.com/article/improvingprint)

or [view the DEMO](https://pimdewit.github.io/improved-print/index.html)


## Installation

npm:
```bash
npm install improved-print
```


## Usage

1. Import the component by adding the following line to the end of your `<body>` tag.
```html
<script src="improved-print.js"></script>
```

2. Create the improved-print tag somewhere in the body.
```html
<improved-print></improved-print>
```

3. Insert some HTML with links you want to print.
```html
<improved-print>
  <article>
    <h1>Hello World!</h1>
    <p>This is an <a href="https://www.google.com/">example link</a></p>
    <a href="https://www.wikipedia.com">Learn more!</a>
  </article>
</improved-print>
```

4. Once you hit print you should see the results directly!


## Future plans / TODO

- Think of a better name(?)
- CSS variables for additional styling
- Option to ignore specific links


## Credits

- Original concept and research: Aaron Gustafson @aarongustafson
- *: Pim de Wit @pdw_io

## Licence

[MIT](https://github.com/PimdeWit/improved-print/blob/master/LICENSE)
