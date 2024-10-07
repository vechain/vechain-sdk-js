# Provider

## Overview

The VeChain Provider is a powerful tool designed to interact with the VeChain blockchain seamlessly. This documentation
outlines the features, usage, and configuration of the VeChain Provider and its companion, the Hardhat Provider.

## VeChain Provider

The VeChain Provider is our core provider, offering direct interaction with the VeChain blockchain. It extends
EventEmitter and implements EIP1193ProviderMessage for efficient event handling and message passing.

### Features

- Seamless interaction with the VeChain blockchain.
- Event handling capabilities using EventEmitter.
- Implementation of EIP1193ProviderMessage for standardized message communication.

### Usage

To use the VeChain Provider in your project, follow these steps:

- Import the provider in your code:
   ``` bash
   import { VeChainProvider } from '@vechain/sdk-network';
   ```
- Initialize the provider:
   ``` bash
   const provider = new VeChainProvider(thorClient, wallet);
   ```
- Start interacting with the VeChain blockchain using the available methods provided by the VeChainProvider.

Example:

```typescript { name=vechain-provider, category=example }
// 1 - Create thor client for testnet
const thorClient = ThorClient.fromUrl(TESTNET_URL);

// 2 - Init provider
const provider = new VeChainProvider(thorClient);

// 3 - Call RPC function
const rpcCallChainId = await provider.request({
    method: 'eth_chainId'
});
```

## HardHat Provider

The Hardhat Provider is a wrapper around the core VeChain Provider specifically designed for Hardhat integration. It
simplifies the process of using the VeChain Provider within a Hardhat environment.

### Features

- Wrapper around the core VeChain Provider.
- Simplified integration with Hardhat projects.

### Usage

To use the Hardhat Provider in your project, follow these steps:

- Import the provider in your code:
   ``` bash
   import { HardhatVeChainProvider } from '@vechain/sdk-network';
   ```
- Initialize the provider:
   ``` bash
   const provider = new HardhatVeChainProvider(
           new ProviderInternalBaseWallet([]),
           testnetUrl,
           (message: string, parent?: Error) => new Error(message, parent)
       );
   ```
- Start interacting with the VeChain blockchain using the available methods provided by the HardhatVeChainProvider.

Example:

```typescript { name=vechain-hardhat-provider, category=example }
// 1 - Init provider
const provider = new HardhatVeChainProvider(
    new ProviderInternalBaseWallet([]),
    TESTNET_URL,
    (message: string, parent?: Error) => new Error(message, parent)
);

// 2 - Call RPC function
const rpcCallChainId = await provider.request({
    method: 'eth_chainId'
});
```

## RPC Methods differences

Comparing to the standard, our RPC methods have some differences in some methods due to the VeChain blockchain's unique
features.
In this section, we will list all methods, and we will see the differences (if any) in each method.
And more we will se if the method is implemented or not.

### debug_getBadBlocks

- Implemented: No

### debug_getRawBlock

- Implemented: No

### debug_getRawHeader

- Implemented: No

### debug_getRawReceipts

- Implemented: No

### debug_getRawTransaction

- Implemented: No

### debug_traceBlockByHash

- Implemented: Yes
- Differences with RPC Standard: No

#### Notes

Since there is no native endpoint for this method,
and since debug operations are cpu intensive, this method can be slow.
It is because we trace each transaction in the block.

### debug_traceBlockByNumber

- Implemented: Yes
- Differences with RPC Standard: No

#### Notes

Since there is no native endpoint for this method,
and since debug operations are cpu intensive, this method can be slow.
It is because we trace each transaction in the block.

### debug_traceCall

- Implemented: Yes
- Differences with RPC Standard: No

#### Notes

Some networks did not support all available tracers.
For example, testnet does not support `prestate` tracer.
So, if you use `prestate` tracer you can get an error.

### debug_traceTransaction

- Implemented: Yes
- Differences with RPC Standard: No

#### Notes

Some networks did not support all available tracers.
For example, testnet does not support `prestate` tracer.
So, if you use `prestate` tracer you can get an error.

### engine_exchangeCapabilities

- Implemented: No

### engine_exchangeTransitionConfigurationV1

- Implemented: No

### engine_forkchoiceUpdatedV1

- Implemented: No

### engine_forkchoiceUpdatedV2

- Implemented: No

### engine_forkchoiceUpdatedV3

- Implemented: No

### engine_getPayloadBodiesByHashV1

- Implemented: No

### engine_getPayloadBodiesByHashV2

- Implemented: No

### engine_getPayloadBodiesByRangeV1

- Implemented: No

### engine_getPayloadV1

- Implemented: No

### engine_getPayloadV2

- Implemented: No

### engine_getPayloadV3

- Implemented: No

### engine_newPayloadV1

- Implemented: No

### engine_newPayloadV2

- Implemented: No

### engine_newPayloadV3

- Implemented: No

### eth_accounts

- Implemented: Yes
- Differences with RPC Standard: No

#### Notes

This method works if and only if we set the wallet in the provider with some accounts.

### eth_blockNumber

- Implemented: Yes
- Differences with RPC Standard: No

### eth_call

- Implemented: Yes
- Differences with RPC Standard: No

### eth_chainId

- Implemented: Yes
- Differences with RPC Standard: No

### eth_coinbase

- Implemented: No

### eth_createAccessList

- Implemented: No

### eth_estimateGas

- Implemented: Yes

### eth_feeHistory

- Implemented: No

### eth_gasPrice

- Implemented: Yes
- Differences with RPC Standard: No

#### Notes

The result is in wei and in VTHO. It because the VeChain blockchain has two tokens, VET and VTHO. VTHO is used for gas.

### eth_getBalance

- Implemented: Yes
- Differences with RPC Standard: No

### eth_getBlockByHash

- Implemented: Yes
- Differences with RPC Standard: No

### eth_getBlockByNumber

- Implemented: Yes
- Differences with RPC Standard: Some differences related to the block number tag and to the output of the function.

#### Notes

Vechain supports only the block number tags 'latest' and 'finalized'.
'earliest', 'safe', and 'pending' are not supported yet.

The fields 'difficulty','totalDifficulty','uncles','sha3Uncles','nonce','logsBloom','extraData','baseFeePerGas','
mixHash' are returned as constant '0x0' because they are not supported yet.

### eth_getBlockReceipts

- Implemented: Yes
- Differences with RPC Standard: Some differences related to the block number tag.

#### Notes

Vechain supports only the block number tags 'latest' and 'finalized'. 'earliest', 'safe', and 'pending' are not
supported yet.

Since there is no native endpoint for this method can be slow. It is because we get the transaction receipt for each
transaction into the block.

### eth_getBlockTransactionCountByHash

- Implemented: Yes
- Differences with RPC Standard: No

### eth_getBlockTransactionCountByNumber

- Implemented: Yes
- Differences with RPC Standard: Some differences related to the block number tag.

#### Notes

Vechain supports only the block number tags 'latest' and 'finalized'. 'earliest', 'safe', and 'pending' are not
supported yet.

### eth_getCode

- Implemented: Yes
- Differences with RPC Standard: Some differences related to the block number tag.

#### Notes

Vechain supports only the block number tags 'latest' and 'finalized'. 'earliest', 'safe', and 'pending' are not
supported yet.

### eth_getFilterChanges

- Implemented: No

### eth_getFilterLogs

- Implemented: No

### eth_getLogs

- Implemented: Yes
- Differences with RPC Standard: Some differences related to output of the function.

#### Notes

'logIndex' and 'transactionIndex' fields are not returned in the logs (they are constant '0x0') for performance reasons.
It because we need to check for each entry of the log, we need to check the block.
'removed' field is always false.

### eth_getProof

- Implemented: No

### eth_getStorageAt

- Implemented: Yes
- Differences with RPC Standard: Some small differences related to the block number tag.ùù

#### Notes

Vechain supports only the block number tags 'latest' and 'finalized'. 'earliest', 'safe', and 'pending' are not
supported yet.

### eth_getTransactionByBlockHashAndIndex

- Implemented: Yes
- Differences with RPC Standard: No

### eth_getTransactionByBlockNumberAndIndex

- Implemented: Yes
- Differences with RPC Standard: Some differences related to the block number tag.

#### Notes

Vechain supports only the block number tags 'latest' and 'finalized'. 'earliest', 'safe', and 'pending' are not
supported yet.

### eth_getTransactionByHash

- Implemented: Yes
- Differences with RPC Standard: Some small differences related to the output of the function.

#### Notes

The following fields: 'gasPrice', 'type', 'v', 'r', 's', 'accessList', 'maxFeePerGas', 'maxPriorityFeePerGas', 'yParity'
are returned as constant '0x0' because they are not supported yet.

### eth_getTransactionCount

- Implemented: Yes
- Differences with RPC Standard: Different meaning into vechain blockchain.

#### Notes

Vechain blockchain have different meaning for the nonce. In vechain, the nonce is a random number. Not a progressive
number.
Since this RPC Method is mainly used to caluclate the nonce, it will return a random number.
This is not only for this motivation, but because currently there is no a direct endpoint to calculate the transaction
count.
More, this behaviot can be customized by the user.
WIth hardhat provider you can set the nonce to have a constant value '0x0' or a random value
with `rpcConfiguration.ethGetTransactionCountMustReturn0` flag into constructor.
This feature is useful for hardhat, and you can do the same with `ethGetTransactionCountMustReturn0` into
the  `hardhat.config.ts` file.

### eth_getTransactionReceipt

- Implemented: Yes
- Differences with RPC Standard: Some small differences related to the output of the function.

#### Notes

The following fields: 'logsBloom', 'cumulativeGasUsed', 'effectiveGasPrice', 'type' are returned as constant '0x0'

### eth_getUncleByBlockHashAndIndex

- Implemented: Yes
- Differences with RPC Standard: Not supported yet.

#### Notes

This method is not supported yet. So it will return an empty object {}.

### eth_getUncleByBlockNumberAndIndex

- Implemented: Yes
- Differences with RPC Standard: Not supported yet.

#### Notes

This method is not supported yet. So it will return an empty object {}.

### eth_getUncleCountByBlockHash

- Implemented: Yes
- Differences with RPC Standard: Not supported yet.

#### Notes

This method is not supported yet. So it will return an empty object {}.

### eth_getUncleCountByBlockNumber

- Implemented: Yes
- Differences with RPC Standard: Not supported yet.

#### Notes

This method is not supported yet. So it will return an empty object {}.

### eth_getWork

- Implemented: No

### eth_hashrate

- Implemented: No

### eth_maxPriorityFeePerGas

- Implemented: No

### eth_newBlockFilter

- Implemented: No

### eth_newFilter

- Implemented: No

### eth_newPendingTransactionFilter

- Implemented: No

### eth_protocolVersion

- Implemented: No

### eth_requestAccounts

- Implemented: Yes
- Differences with RPC Standard: No

### eth_sendRawTransaction

- Implemented: Yes
- Differences with RPC Standard: No

### eth_sendTransaction

- Implemented: Yes
- Differences with RPC Standard: Small differences related on input parameters.

#### Notes

The parameter 'gasPrice' cannot be used together with 'maxPriorityFeePerGas' and 'maxFeePerGas'.
'maxPriorityFeePerGas' and 'maxFeePerGas' are not supported in the current version.

### eth_sign

- Implemented: No

### eth_signTransaction

- Implemented: Yes
- Differences with RPC Standard: No

### eth_signTypedData_v4

- Implemented: Yes
- Differences with RPC Standard: No

### eth_submitWork

- Implemented: No

### eth_subscribe

- Implemented: Yes

### eth_syncing

- Implemented: Yes
- Differences with RPC Standard: Some differences related to the output of the function.

#### Notes

The 'startingBlock' field is always '0x0' because it is not supported yet.

The fields 'difficulty','totalDifficulty','uncles','sha3Uncles','nonce','logsBloom','extraData','baseFeePerGas','
mixHash' are returned as constant '0x0' because they are not supported yet.

### eth_uninstallFilter

- Implemented: No

### eth_unsubscribe

- Implemented: Yes
- Differences with RPC Standard: No

### evm_mine

- Implemented: Yes
- Differences with RPC Standard: Some differences related to the output of the function.

#### Notes

The fields 'difficulty','totalDifficulty','uncles','sha3Uncles','nonce','logsBloom','extraData','baseFeePerGas','
mixHash' are returned as constant '0x0' because they are not supported yet.

### net_listening

- Implemented: Yes
- Differences with RPC Standard: No

### net_peerCount

- Implemented: Yes
- Differences with RPC Standard: No

### net_version

- Implemented: Yes
- Differences with RPC Standard: No

### parity_nextNonce

- Implemented: No

### txpool_content

- Implemented: Yes
- Differences with RPC Standard: Not supported yet, so it will return an empty object {}.

### txpool_contentFrom

- Implemented: Yes
- Differences with RPC Standard: Not supported yet, so it will return an empty object {}.

### txpool_inspect

- Implemented: Yes
- Differences with RPC Standard: Not supported yet, so it will return an empty object {}.

### txpool_status

- Implemented: Yes
- Differences with RPC Standard: Not supported yet, so it will return an empty object {}.

### web3_clientVersion

- Implemented: Yes
- Differences with RPC Standard: No

### web3_sha3

- Implemented: Yes
- Differences with RPC Standard: No
