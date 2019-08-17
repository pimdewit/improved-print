<p align="center">
    <img src="https://github.com/pimdewit/improved-print/raw/master/.git-header.svg?sanitize=true" alt="Improved print">
</p>

<p align="center">
    <h1>improved-print</h1>
    <a href="https://www.webcomponents.org/element/pimdewit/improved-print"><img src="https://img.shields.io/badge/webcomponents.org-published-blue.svg" alt="Published on webcomponents.org"></a>
    <img src="https://img.shields.io/bundlephobia/minzip/improved-print?label=filesize" alt="Total filesize is 971bytes">
</p>

improved-print is a native custom-element.
It's purpose is to strip out links within content, and make a nice list of footnotes when attempting to print.

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
    <p>This is an <a href="https://www.google.com/">example link</a>. And <a href="https://pdw.io" data-no-improved-print>this</a> is a link that is ignored on print.</p>
    <a href="https://www.wikipedia.com">Learn more!</a>
  </article>
</improved-print>
```

4. Once you hit print you should see the results directly!


## Future plans / TODO

- Think of a better name(?)
- CSS variables for additional styling


## Credits

- [Original concept](https://alistapart.com/article/improvingprint): Aaron Gustafson [@aarongustafson](https://twitter.com/AaronGustafson)
- *: Pim de Wit [@pdw_io](https://twitter.com/pdw_io)

## Licence

[MIT](https://github.com/PimdeWit/improved-print/blob/master/LICENSE)
