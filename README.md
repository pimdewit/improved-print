# Improved Print

<improved-print> is a 'leaf' custom-element. It's sole purpose is to encapsulate HTML, strip out the links within the content, and make a nice list of footnotes when attempting to print.

This web component is based on an A List Apart article from 2005(!), written by [@AaronGustafson](https://twitter.com/AaronGustafson).

Visit the original article: [https://alistapart.com/article/improvingprint](https://alistapart.com/article/improvingprint)

## Installation

npm:
`npm install improved-print`

Bower:
`bower install improved-print`

## Usage

1. Import the component.
`<link rel="import" href="improved-print.html">`

2. Create the improved-print tag somewhere in the body.
`<improved-print></improved-print>`

3. Insert some HTML, and bind it to the "content" slot.
```
<improved-print>
  <article slot="content">
    <h1>Hello World!</h1>
    <p>This is an <a href="https://www.google.com/">example link</a></p>
    <a href="https://www.wikipedia.com">Learn more!</a>
  </article>
</improved-print>
```

4. Once you hit print you should see the results directly!

## Future plans / TODO

- CSS variables for additional styling
- Option to ignore specific links


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Credits

Original concept and research: Aaron Gustafson @aarongustafson
*: Pim de Wit @pdw_io

## License

MIT License.
