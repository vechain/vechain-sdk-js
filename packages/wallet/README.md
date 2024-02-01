# @vechain/vechain-sdk-network

Welcome to the **wallet package** of the vechain SDK!

## Introduction
Wallet enables users to manage their accounts and sign transactions by using different kinds of wallet.

## Key Features

The vechain SDK Wallet package provides features for wallet management and transaction signing.
Basically, it provides a standard Wallet interface.
All other wallet implementations should implement this interface.
This allows developers to use different kinds of wallet without changing vechain development stack.

For instance, the provider package uses the wallet interface to get addresses.
This means that the provider package can be used with any wallet implementation, BUT the wallet implementation must implement the wallet interface.

## Commands

- **Build**: Execute `yarn build` to build the package.
- **Lint**: Execute `yarn lint` to lint the package.
- **Format**: Execute `yarn format` to format the package.
- **Test:unit**: Execute `yarn test:unit` to run unit tests.
- **Test:integration**: Execute `yarn test:integration` to run integration tests.
- **Test**: Execute `yarn test` to run all tests on the package.
   - **NOTE**: Tests and Integration tests require thor-solo to be running locally. You can run and stop separately thor solo node with `yarn start-thor-solo` and `yarn stop-thor-solo` or run all tests with `yarn test:solo` which will start thor solo node, run all tests and stop thor solo at the end. Same for integration tests. You can directly run `yarn test:integration:solo` to run integration tests with thor solo.

## Usage

Explore examples of how to use this package in real-world scenarios at [vechain SDK examples](https://github.com/vechain/vechain-sdk/tree/main/docs/examples).

Feel free to leverage these resources and don't hesitate to reach out if you have any questions or need further assistance.

Happy coding with the vechain SDK!
