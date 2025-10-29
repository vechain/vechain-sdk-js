## Documentation and Examples

On the `/docs` folder you can find the comprehensive **SDK documentation** and executable code examples.
We've designed these examples not just for learning purposes but also as integration tests,
ensuring that the provided code snippets are always functional and up to date.

### Examples

Our code examples reside in the `./docs/examples` folder. Each example is a stand-alone script that showcases various operations achievable with the SDK. Some of the code examples require a Thor Solo node to be available.

To run the scripts within `./docs/examples` as tests, use:
``` bash
yarn test:examples
```

**NOTE**: Tests require thor-solo to be running locally. You can run and stop separately thor solo node with `yarn start-thor-solo` and `yarn stop-thor-solo` or run all tests with `yarn test:examples:solo` which will start thor solo node, run all tests and stop thor solo at the end.

### Templates

In the `./docs/templates` folder, you'll find markdown files used to build our final documentation. These templates can include links to example files, dynamically expanded into code snippets during documentation generation.

For instance:

\[example](../docs/examples/accounts/bip39.ts)

The above link, when processed during documentation build, expands into the content of the linked file, ensuring our documentation is as practical as possible.

Note: links that are to be expanded must have a text \[example]

#### Code Snippets

It's also possible to include just a code snippet from an example file. For instance:

[DeployContractSnippet](../docs/examples/contracts/contract-create-ERC20-token.ts)

Will just include into the documentation the code snippet between the comments `// START_SNIPPET: DeployContractSnippet` and `// END_SNIPPET: DeployContractSnippet` in the file `examples/contracts/contract-create-ERC20-token.ts`.

Important: The code snippets names must be unique across all examples and must end with the word "Snippet".

In this way we can keep the examples dry and avoid duplicating code.


### Usage

To build the documentation, expanding examples into code snippets, use:
``` bash
yarn build
```

### Architecture diagrams

For a comprehensive overview of the package structure, please refer to our [Architecture Diagrams](../docs/diagrams/) located in the documentation directory.

- You can also create and test your examples using `yarn test:examples` command (with solo `yarn test:examples:solo`).