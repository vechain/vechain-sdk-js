# @vechain/sdk-rpc-proxy

Welcome to the **RPC Proxy** of the VeChain SDK!

## Introduction

The RPC Proxy is designed to bridge the gap between Thor's RESTful API and Ethereum's JSON-RPC, enabling seamless
interaction with the VeChainThor blockchain through RPC calls. It is particularly useful for integrating with tools such
as the Remix IDE.

The RPC Proxy can be optionally configured to:

* sign transactions for `eth_signTransaction` RPC method
* use a vechain account for fee delegation

## Useage

The RPC proxy can be used in two different ways:

* Executing directly via node package execute (npx)
* Executing via Docker container

Both ways of using can be configured via a configuration file or using command line options

## Starting the Proxy 

To install the RPC proxy for NPX useage, use the following command:

``` bash
yarn add @vechain/sdk-rpc-proxy
```

To start the proxy, run:

``` bash
npx rpc-proxy
```

To start the proxy with Docker:

``` bash
docker run -d -p 8545:8545 -t vechain/sdk-rpc-proxy:<tag>
```

*By default*, the proxy is configured to be used with a solo node running on your local machine. 
There are two options if you want to change the default behavior, or use a custom configuration:
 - Create a `config.json` file and pass it to the command when launching the RPC Proxy
 - Use CLI options


## CLI Options

The following CLI options exist.
CLI options override any used configuration file.

| NPX CLI Option                          | Description                                             |
|-----------------------------------------|---------------------------------------------------------|
| -p (--port) <number>                    | port number for the service                             |
| -c (--configurationFile) <filepath>     | path to configuration file                              |
| -u (--url) <url>                        | url to vechain thor node                                |
| -v (--verbose)                          | to turn on verbose logging                              |
| -a (--accounts) <keys>                  | the private keys used to sign tx's                      |
| -m (--mnemonic) <mnemonic>              | mnemonic to derive private keys to sign tx's with       |
| -mc (--mnemonicCount) <number>          | the number of accounts to derive from the mnemonic      |
| -mi (--mnemonicInitialIndex) <number>   | index to start deriving accounts from the mnemonic      |
| -e (--enableDelegation)                 | turns on fee delegation for signed tx's                 |
| --gasPayerPrivateKey <key>              | private key of the gas payer                            |
| -s (--gasPayerServiceUrl) <url>         | fee delegation service url                              |


For docker based execution, CLI options are passed as environment variables.


| Docker ENV Variable                     | Description                                             |
|-----------------------------------------|---------------------------------------------------------|
| URL                                     | url to vechain thor node                                |
| PORT                                    | internal port number for the service                    |
| ACCOUNTS                                | private keys to sign transactions                       |
| MNEMONIC                                | mnemonic to derive private keys to sign tx's with       |
| MNEMONIC_COUNT                          | the number of accounts to derive from the mnemonic      |
| MNEMONIC_INITIAL_INDEX                  | index to start deriving accounts from the mnemonic      |
| ENABLE_DELEGATION                       | turns on fee delegation for signed tx's                 |
| GAS_PAYER_PRIVATE_KEY                   | private key of the gas payer                            |
| GAS_PAYER_SERVICE_URL                   | fee delegation service url                              |
| CONFIGURATION_FILE                      | path to configuration file                              |


#### NPX CLI Examples:

- passing configuration file and port:
    - `npx rpc-proxy -c /path/of/custom-config.json -p 8545 -v ...`

- passing url of vechain thor node:
    - `npx rpc-proxy -u http://testnet.vechain.org` OR `rpc-proxy --url http://testnet.vechain.org`

- enabling verbose logging:
    - `npx rpc-proxy -v` OR `rpc-proxy --verbose`

- specificying the accounts (private keys) to sign transactions. It is a space-separated list of private keys.
    - `npx rpc-proxy -a "7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158 8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158"`
    - `npx rpc-proxy --accounts "7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158 8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158"`

- specifying the mnemonic to derive tx signing accounts from:
    - `npx rpc-proxy -m "denial kitchen pet squirrel other broom bar gas better priority spoil cross" -mc 10 -mi 1`
    - `npx rpc-proxy --mnemonic "denial kitchen pet squirrel other broom bar gas better priority spoil cross" --mnemonicCount 10 --mnemonicInitialIndex 1`
    - **NOTE**: --mnemonic, --mnemonicCount, and --mnemonicInitialIndex MUST be used together.

- enabling fee delegation:
    - `npx rpc-proxy -e -gk 8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158`
    - `npx rpc-proxy --enableDelegation --gasPayerPrivateKey 8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158`
    - `npx rpc-proxy -e -s https://sponsor-testnet.vechain.energy/by/...`
    - `npx rpc-proxy --enableDelegation --gasPayerServiceUrl https://sponsor-testnet.vechain.energy/by/...`
    - **NOTE**: --gasPayerPrivateKey and --gasPayerServiceUrl are mutually exclusive.
    - **NOTE**: if --enableDelegation is used, --gasPayerPrivateKey OR --gasPayerServiceUrl MUST be used also.


#### Docker Run Examples

- default configuration pointing to testnet nodes:
  - `docker run -d -p 8545:8545 -e URL=https://testnet.vechain.org -t vechain/sdk-rpc-proxy:<tag>`

- using a configuration file:
  -  `docker run -d -p 8545:8545 -v ./rpc-proxy-testnet-config.json:/app/packages/rpc-proxy/config.json -e CONFIGURATION_FILE=/app/packages/rpc-proxy/config.json   -t vechain/sdk-rpc-proxy:<tag>`
`


## Configuration File

The `config.json` file is used to configure the proxy server. It contains the following fields:

- `url`: The URL of the VeChainThor node.
- `port`: The port of the proxy server.
- `accounts`: The accounts that the proxy server will use to sign transactions (can be a mnemonic or an array of private keys).
- `verbose`: Wheter to enable verbose logging.
- `debug`: Whether to enable debug mode.
- `enableDelegation`: Whether to enable delegation.
- `gasPayer`: Specifies gasPayer private key or fee delegation service url

### Using Configuration file

For NPX useage the configuration file is passed via the `-c` or `--configurationFile` command line parameter:

``` bash
npx rpc-proxy -c <json config file>
npx rpc-proxy --configurationFile <json config file>
```

For Docker useage the configuration file is mounted as a volume, and the env variable CONFIGURATION_FILE is set to its location:

``` bash
docker run -d -p 8545:8545 -v ./rpc-proxy-testnet-config.json:/app/packages/rpc-proxy/config.json -e CONFIGURATION_FILE=/app/packages/rpc-proxy/config.json   -t vechain/sdk-rpc-proxy:<tag>
```

### Example Configuration Files

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
    "gasPayerPrivateKey": "8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158"
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
    "gasPayerServiceUrl": "https://sponsor-testnet.vechain.energy/by/..."
  },
  "enableDelegation": true
}
```

## Appendix - JSON RPC Methods Support Status

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

### RPC to VeChain Mappings

The following mappings are performed by the RPC proxy

| RPC Parameter                          | VeChain Parameter     |
|----------------------------------------|-----------------------|
| block hash                             | block id              |
| latest block                           | best block            |
| safe block                             | justified block       |
| finalized block                        | finalized block       |
| pending block                          | best block            |
| earliest block                         | block number 0        |


The method `eth_chainId` returns:

* `0x186a9` for mainnet
* `0x186aa` for testnet
* for solo or other custom networks it returns the _chainTag_ (the last byte of the genesis block id)


### Transaction Conversions

The method `eth_sendTransaction` requires the input to be a VeChain transaction object, not a Ethereum transaction object  
This method signs the transaction using the configured PK, before passing it on to VeChain Thor

For method `eth_sendRawTransaction` the signed encoded raw transaction parameter must be a vechain transaction object  
This method cannot convert a signed Ethereum transaction to a signed VeChain transaction



