# Code Examples & Documentation

Welcome to the `/docs` folder, your go-to resource for comprehensive **SDK documentation** and executable code examples. We've designed these examples not just for learning purposes but also as integration tests, ensuring that the provided code snippets are always functional and up-to-date.

## Structure

### Examples

Our code examples reside in the `/examples` folder. Each example is a stand-alone script that showcases various operations achievable with the SDK.

Some of the code examples require a Thor Solo node to be available.

### Templates

In the `/templates` folder, you'll find markdown files used to build our final documentation. These templates can include links to example files, dynamically expanded into code snippets during documentation generation.

For instance:

\[example](examples/accounts/bip39.ts)

The above link, when processed during documentation build, expands into the content of the linked file, ensuring our documentation is as practical as possible.

Note: links that are to be expanded must have text \[example]

## Usage

### Execute Examples as Tests

To run the scripts within /examples as tests, use:
``` bash
yarn test:examples
```

**NOTE**: Tests require thor-solo to be running locally. You can run and stop separately thor solo node with `yarn start-thor-solo` and `yarn stop-thor-solo` or run all tests with `yarn test:examples:solo` which will start thor solo node, run all tests and stop thor solo at the end.


### Build Documentation

To build the documentation, expanding examples into code snippets, use:
``` bash
yarn build
```

Feel free to explore the examples and templates, and don't hesitate to reach out if you have any questions or need further assistance.

Happy coding with the vechain SDK!