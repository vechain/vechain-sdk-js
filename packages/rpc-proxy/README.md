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

By default, the proxy is configured to be used with a solo node running on your local machine. There are two options if you want to change the default behavior, or use a custom configuration:
 - Create a config.json file and pass it to the command when launching the RPC Proxy.
 - Use CLI options.

## Configuration file

Run:

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
    - -e.g.- `npx rpc-proxy -p 8545 -v ...`

- a custom configuration file and override some values with the cli options
    - -e.g.- `npx rpc-proxy -c /path/of/custom-config.json -p 8545 -v ...`

### Cli options list

#### Give the configuration file

- `-c, --configurationFile <config>`: The path to the configuration file.
    - -e.g.- `npx rpc-proxy -c /path/of/custom-config.json` OR `rpc-proxy --configurationFile custom-config.json`

- `-p, --port <port>`: The port on which the proxy server will run.
    - -e.g.- `npx rpc-proxy -p 8545` OR `rpc-proxy --port 8545`

- `-u, --url <url>`: The URL of the VeChainThor node.
    - -e.g.- `npx rpc-proxy -u http://testnet.vechain.org` OR `rpc-proxy --url http://testnet.vechain.org`

- `-v, --verbose`: Whether to enable verbose logging.
    - -e.g.- `npx rpc-proxy -v` OR `rpc-proxy --verbose`

#### Give the accounts

- `-a, --accounts <accounts>`: The accounts (private keys) that the proxy server will use to sign transactions. It is a
  space-separated list of private keys.
    - -e.g.- `npx rpc-proxy -a "7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158 8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158"`
    OR `npx rpc-proxy --accounts "7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158 8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158"`

- `-m, --mnemonic <mnemonic>`: The mnemonic that the proxy server will use to sign transactions.
- `--mnemonicCount <mnemonicCount>`: The number of accounts to derive from the mnemonic.
- `--mnemonicInitialIndex <mnemonicInitialIndex>`: The index from which to start deriving accounts from the
  mnemonic.
    - -e.g.- `npx rpc-proxy -m "denial kitchen pet squirrel other broom bar gas better priority spoil cross" --mnemonicCount 10 --mnemonicInitialIndex 1`
      OR `npx rpc-proxy --mnemonic "denial kitchen pet squirrel other broom bar gas better priority spoil cross" --mnemonicCount 10 --mnemonicInitialIndex 1`
    - **NOTE**: --mnemonic, --mnemonicCount, and --mnemonicInitialIndex MUST be used together.

#### Use delegation

- `-e, --enableDelegation`: Whether to enable delegation.
- `--delegatorPrivateKey <delegatorPrivateKey>`: The private key of the delegator.
- `-d, --delegatorUrl <delegatorUrl>`: The URL of the delegator.
    - -e.g.- `npx rpc-proxy -e --delegatorPrivateKey 8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158`
      OR `npx rpc-proxy --enableDelegation --delegatorPrivateKey 8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158`
    - -e.g.- `npx rpc-proxy -e -d https://sponsor-testnet.vechain.energy/by/...`
      OR `npx rpc-proxy --enableDelegation --delegatorUrl https://sponsor-testnet.vechain.energy/by/...`
    - **NOTE**: --delegatorPrivateKey and --delegatorUrl are mutually exclusive.
    - **NOTE**: if --enableDelegation is used, --delegatorPrivateKey OR --delegatorUrl MUST be used.

## Configuration file

The `config.json` file is used to configure the proxy server. It contains the following fields:

- `url`: The URL of the VeChainThor node.
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

Simple testnet configuration with a gasPayer private key:

``` json
{
  "url": "https://testnet.vechain.org",
  "port": 8545,
  "accounts": {
    "mnemonic": "expire pair material agent north ostrich fortune level cousin snow mixture nurse",
    "count": 10,
    "initialIndex": 0
  },
  "gasPayer": {
    "delegatorPrivateKey": "8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158"
  },
  "enableDelegation": true
}
```

Simple testnet configuration with a gasPayer private url:

``` json
{
  "url": "https://testnet.vechain.org",
  "port": 8545,
  "accounts": {
    "mnemonic": "expire pair material agent north ostrich fortune level cousin snow mixture nurse",
    "count": 10,
    "initialIndex": 0
  },
  "gasPayer": {
    "delegatorUrl": "https://sponsor-testnet.vechain.energy/by/..."
  },
  "enableDelegation": true
}
```

# Run as Docker Container

To run the RPC proxy as a Docker container, follow these steps:

``` bash
cd ../..
docker build -f docker/rpc-proxy/Dockerfile . -t vechain/sdk-rpc-proxy
# To replace the default config file, update the config.json file and start a terminal from the folder in which the file is located. 
# DISCLAIMER: Make sure you replace the default config file before using it for production software. By default, the docker will point to testnet and use a known mnemonic. 
docker run -d -p 8545:8545 -v ./config.json:/app/packages/rpc-proxy/config.json -t vechain/sdk-rpc-proxy
```

If you do not pass a config.json file, the default solo network standard configuration will be used. Make sure to
provide your desired configuration file.

## JSON RPC Methods Support Status

Below is the support status for JSON RPC methods in VeChain via `sdk-rpc-proxy`.

| JSON RPC Method                          | Support Status      |
|------------------------------------------|---------------------|
| debug_traceBlockByHash                   | Fully Supported     |
| debug_traceBlockByNumber                 | Fully Supported     |
| debug_traceCall                          | Fully Supported     |
| debug_traceTransaction                   | Fully Supported     |
| eth_accounts                             | Fully Supported     |
| eth_blockNumber                          | Fully Supported     |
| eth_call                                 | Partially Supported |
| eth_chainId                              | Fully Supported     |
| eth_coinbase                             | Fully Supported     |
| eth_createAccessList                     | Fully Supported     |
| eth_estimateGas                          | Partially Supported |
| eth_gasPrice                             | Fully Supported     |
| eth_getBalance                           | Fully Supported     |
| eth_getBlockByHash                       | Partially Supported |
| eth_getBlockByNumber                     | Partially Supported |
| eth_getBlockReceipts                     | Fully Supported     |
| eth_getBlockTransactionCountByHash       | Fully Supported     |
| eth_getBlockTransactionCountByNumber     | Fully Supported     |
| eth_getCode                              | Fully Supported     |
| eth_getLogs                              | Partially Supported |
| eth_getStorageAt                         | Fully Supported     |
| eth_getTransactionByBlockHashAndIndex    | Fully Supported     |
| eth_getTransactionByBlockNumberAndIndex  | Fully Supported     |
| eth_getTransactionByHash                 | Fully Supported     |
| eth_getTransactionCount                  | Partially Supported |
| eth_getTransactionReceipt                | Fully Supported     |
| eth_getUncleByBlockHashAndIndex          | Partially Supported |
| eth_getUncleByBlockNumberAndIndex        | Partially Supported |
| eth_getUncleCountByBlockHash             | Partially Supported |
| eth_getUncleCountByBlockNumber           | Partially Supported |
| eth_requestAccounts                      | Fully Supported     |
| eth_sendRawTransaction                   | Fully Supported     |
| eth_sendTransaction                      | Fully Supported     |
| eth_signTransaction                      | Fully Supported     |
| eth_signTypedDataV4                      | Fully Supported     |
| eth_subscribe                            | Fully Supported     |
| eth_syncing                              | Partially Supported |
| eth_unsubscribe                          | Fully Supported     |
| evm_mine                                 | Fully Supported     |
| net_listening                            | Fully Supported     |
| net_peerCount                            | Fully Supported     |
| net_version                              | Fully Supported     |
| txpool_content                           | Partially Supported |
| txpool_contentFrom                       | Partially Supported |
| txpool_inspect                           | Partially Supported |
| txpool_status                            | Partially Supported |
| web3_clientVersion                       | Fully Supported     |
| web3_sha3                                | Fully Supported     |
| eth_getUncleByBlockHash                  | Not Supported       |
| eth_getUncleByBlockNumber                | Not Supported       |
| eth_newFilter                            | Not Supported       |
| eth_newBlockFilter                       | Not Supported       |
| eth_newPendingTransactionFilter          | Not Supported       |
| eth_uninstallFilter                      | Not Supported       |
| eth_getFilterChanges                     | Not Supported       |
| eth_getFilterLogs                        | Not Supported       |
| eth_getProof                             | Not Supported       |
| txpool_inspectFrom                       | Not Supported       |

### Notes
- **Fully Supported**: The method is implemented and works as expected.
- **Partially Supported**: The method is implemented but may have limitations or deviations from the Ethereum standard.
- **Not Supported**: The method is not implemented or cannot be supported due to protocol constraints.
