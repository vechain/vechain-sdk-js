# Code Examples & Documentation

The `/docs` folder contains code examples to show how to achieve various operations with the SDK

These code examples are also executable integration tests, and the code snippets within the `/examples` folder are executed as tests. This ensures that code examples and documentation are always working and up to date.

Some of the code examples require a Thor Solo node to be available.

## Examples

Code examples are written as stand-alone scripts within the `/examples` folder


## Templates

The `/templates` folder contains documentation markdown files that are used to build the final markdown documentation files. Templates can include a link to an example file, which when the documentation is build is expanded into a code snippet.

For example the link:

\[example](examples/accounts/bip39.ts)

Will be expanded into a code snippet with the content of that file

Note: links that are to be expanded must have text \[example]

## Scripts

* To execute the scripts within `/examples` as tests: `yarn test:examples`
* To build the documentation by expanding examples: `yarn build`
* To execute code from the built documentation (build check): `yarn test`




