# @vechain/sdk-rpc-proxy

Welcome to the **RPC Proxy** of the VeChain SDK!

## Introduction

The RPC Proxy is designed to bridge the gap between Thor's RESTful API and Ethereum's JSON-RPC, enabling seamless
interaction with the VeChainThor blockchain through RPC calls. It is particularly useful for integrating with tools such
as the Remix IDE.

## Installation

To install the RPC proxy, use the following command:

``` bash
yarn add @vechain/sdk-rpc-proxy
```

## Usage

The RPC proxy is simple to use. To start it, run:

``` bash
npx rpc-proxy
```

By default, the proxy is configured to be used with a solo node running on your local machine. If you want to change the
default behavior, create a config.json file and pass it to the command when launching the RPC Proxy:

``` bash
npx rpc-proxy -c <json config file>
```

Or:

``` bash
npx rpc-proxy --configurationFile <json config file>
```

## CLI Options

With rpc-proxy, you can use the following CLI options.
Cli options override the configuration file.
So you can run the rpc-proxy with:

- a configuration file with the default values and override them with the cli options
    - -e.g.- `rpc-proxy -p 8545 -v ...`

- a custom configuration file and override some values with the cli options
    - -e.g.- `rpc-proxy -c /path/of/custom-config.json -p 8545 -v ...`

### Cli options list

#### Give the configuration file

- `-c, --configurationFile <config>`: The path to the configuration file.
    - -e.g.- `rpc-proxy -c /path/of/custom-config.json` OR `rpc-proxy --configurationFile custom-config.json`

- `-p, --port <port>`: The port on which the proxy server will run.
    - -e.g.- `rpc-proxy -p 8545` OR `rpc-proxy --port 8545`

- `-u, --url <url>`: The URL of the VeChain Thor node.
    - -e.g.- `rpc-proxy -u http://testnet.vechain.org` OR `rpc-proxy --url http://testnet.vechain.org`

- `-v, --verbose`: Whether to enable verbose logging.
    - -e.g.- `rpc-proxy -v` OR `rpc-proxy --verbose`

#### Give the accounts

- `-a, --accounts <accounts>`: The accounts (private keys) that the proxy server will use to sign transactions. It is a
  space-separated list of private keys.
    -
    -e.g.- `rpc-proxy -a "7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158 8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158"`
    OR `rpc-proxy --accounts "7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158 8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158"`

- `-m, --mnemonic <mnemonic>`: The mnemonic that the proxy server will use to sign transactions.
- `-mc, --mnemonicCount <mnemonicCount>`: The number of accounts to derive from the mnemonic.
- `-mi, --mnemonicInitialIndex <mnemonicInitialIndex>`: The index from which to start deriving accounts from the
  mnemonic.
    - -e.g.- `rpc-proxy -m "denial kitchen pet squirrel other broom bar gas better priority spoil cross" -mc 10 -mi 1`
      OR `rpc-proxy --mnemonic "denial kitchen pet squirrel other broom bar gas better priority spoil cross" --mnemonicCount 10 --mnemonicInitialIndex 1`
    - **NOTE**: --mnemonic, --mnemonicCount, and --mnemonicInitialIndex MUST be used together.

#### Use delegation

- `-e, --enableDelegation`: Whether to enable delegation.
- `-dp, --delegatorPrivateKey <delegatorPrivateKey>`: The private key of the delegator.
- `-du, --delegatorUrl <delegatorUrl>`: The URL of the delegator.
    - -e.g.- `rpc-proxy -e -dp 8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158`
      OR `rpc-proxy --enableDelegation --delegatorPrivateKey 8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158`
    - -e.g.- `rpc-proxy -e -du https://sponsor-testnet.vechain.energy/by/...`
      OR `rpc-proxy --enableDelegation --delegatorUrl https://sponsor-testnet.vechain.energy/by/...`
    - **NOTE**: --delegatorPrivateKey and --delegatorUrl are mutually exclusive.
    - **NOTE**: if --enableDelegation is used, --delegatorPrivateKey OR --delegatorUrl MUST be used.

# Run as Docker Container

To run the RPC proxy as a Docker container, follow these steps:

``` bash
docker build . -t vechain-rpc-proxy
docker run -d -p 8545:8545 -v ./config.json:/app/config.json -t vechain-rpc-proxy
```

If you do not pass a config.json file, the default solo network standard configuration will be used. Make sure to
provide your desired configuration file.

## Configuration

The `config.json` file is used to configure the proxy server. It contains the following fields:

- `url`: The URL of the VeChain Thor node.
- `port`: The port of the proxy server.
- `accounts`: The accounts that the proxy server will use to sign transactions (can be a mnemonic or an array of private
  keys).
- `verbose`: Wheter to enable verbose logging.
- `debug`: Whether to enable debug mode.
- `enableDelegation`: Whether to enable delegation.

### Example Configurations

Simple thor solo configuration with mnemonic:

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

Simple thor solo configuration with accounts as a list of private keys:

``` json
{
    "url": "http://127.0.0.1:8669",
    "port": 8545,
    "accounts": [
        "7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158",
        "8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158"
    ],
    "verbose": true,
    "enableDelegation": false
}
```

Simple testnet configuration with a delegator private key:

``` json
{
  "url": "https://testnet.vechain.org",
  "port": 8545,
  "accounts": {
    "mnemonic": "expire pair material agent north ostrich fortune level cousin snow mixture nurse",
    "count": 10,
    "initialIndex": 0
  },
  "delegator": {
    "delegatorPrivateKey": "8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158"
  },
  "enableDelegation": true
}
```

Simple testnet configuration with a delegator private url:

``` json
{
  "url": "https://testnet.vechain.org",
  "port": 8545,
  "accounts": {
    "mnemonic": "expire pair material agent north ostrich fortune level cousin snow mixture nurse",
    "count": 10,
    "initialIndex": 0
  },
  "delegator": {
    "delegatorUrl": "https://sponsor-testnet.vechain.energy/by/..."
  },
  "enableDelegation": true
}
```