# @vechain/sdk-remix-proxy

Welcome to the **remix proxy** of the vechain SDK!

## Introduction
This project is designed to bridge the gap between Thor's RESTful API and Ethereum's JSON-RPC, for example to support the Remix IDE. By leveraging this proxy, users can seamlessly interact with the VeChain Thor blockchain.

## Commands

- **Build**: Execute `yarn build` to build the package.
- **Lint**: Execute `yarn lint` to lint the package.
- **Format**: Execute `yarn format` to format the package.
- **Start**: Execute `yarn start` to start the proxy server.

# Usage

Explore examples of how to use this package in real-world scenarios at [vechain SDK examples](https://github.com/vechain/vechain-sdk/tree/main/docs/examples).
RPC proxy is very simple to use. To run it, you must:

Feel free to leverage these resources and don't hesitate to reach out if you have any questions or need further assistance.
1. Set up your config in `config.json` file.
2. Run `yarn start` to start the proxy server.
3. Enjoy!

Happy coding with the vechain SDK!
## Configuration

The `config.json` file is used to configure the proxy server. It contains the following fields:

- `url`: The URL of the VeChain Thor node.
- `port`: The port of the proxy server.
- `accounts`: The accounts that the proxy server will use to sign transactions.
- `debug`: Whether to enable debug mode.