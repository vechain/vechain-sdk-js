# @vechain/sdk-rpc-proxy

Welcome to the **RPC Proxy** of the VeChain SDK!

## Introduction

The RPC Proxy is designed to bridge the gap between Thor's RESTful API and Ethereum's JSON-RPC, enabling seamless interaction with the VeChainThor blockchain through RPC calls. It is particularly useful for integrating with tools such as the Remix IDE.

## Installation

To install the RPC proxy, use the following command:
``` bash
yarn add @vechain/sdk-rpc-proxy
rpc-proxy
```

## Usage

The RPC proxy is simple to use. To start it, run:
``` bash
rpc-proxy
```

By default, the proxy is configured to be used with a solo node running on your local machine. If you want to change the default behavior, create a config.json file and pass it to the command when launching the RPC Proxy:
``` bash
rpc-proxy -c <json config file>
```
Or:
``` bash
rpc-proxy --config <json config file>
```

# Run as Docker Container

To run the RPC proxy as a Docker container, follow these steps:
``` bash
docker build . -t vechain-rpc-proxy
docker run -d -p 8545:8545 -v ./config.json:/app/config.json -t vechain-rpc-proxy
```

If you do not pass a config.json file, the default solo network standard configuration will be used. Make sure to provide your desired configuration file.

## Configuration

The `config.json` file is used to configure the proxy server. It contains the following fields:

- `url`: The URL of the VeChain Thor node.
- `port`: The port of the proxy server.
- `accounts`: The accounts that the proxy server will use to sign transactions (can be a mnemonic or an array of private keys).
- `verbose`: Wheter to enable verbose logging.
- `debug`: Whether to enable debug mode.
- `enableDelegation`: Whether to enable delegation.

### Example Configuration

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