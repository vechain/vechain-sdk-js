# @vechain/sdk-rpc-proxy

Welcome to the **RPC Proxy** of the VeChain SDK!

## Introduction
This project is designed to bridge the gap between Thor's RESTful API and Ethereum's JSON-RPC, for example to support the Remix IDE. By leveraging this proxy, users can seamlessly interact with the VeChainThor blockchain via RPC calls.

# Usage

The RPC proxy is very simple to use. To run it:
``` bash
yarn add @vechain/sdk-rpc-proxy
rpc-proxy
```

By default the Proxy is configured to be used with a solo node running in your local machine. If you want to change the default behaviour, simply create a `config.json` file and pass it to the command when launching the RPC Proxy:
``` bash
rpc-proxy -c <json config file>
```
Or:
``` bash
rpc-proxy --config <json config file>
```

## Configuration

The `config.json` file is used to configure the proxy server. It contains the following fields:

- `url`: The URL of the VeChain Thor node.
- `port`: The port of the proxy server.
- `accounts`: The accounts that the proxy server will use to sign transactions (can be a mnemonic or an array of private keys).
- `verbose`: Wheter to enable verbose logging.
- `debug`: Whether to enable debug mode.
- `enableDelegation`: Whether to enable delegation.

As an example:
``` json
{
    "url": "http://127.0.0.1:8669",
    "port": 8545,
    "accounts": {
        "mnemonic": "denial kitchen pet squirrel other broom bar gas better priority spoil cross",
        "count": 10
    },
    "verbose": true,
    "enableDelegation": false
}
```