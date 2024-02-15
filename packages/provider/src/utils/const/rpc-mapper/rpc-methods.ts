/**
 * List of all valid ethereum RPC methods
 *
 * @note following links for more details:
 * * https://eth.wiki/json-rpc/API
 * * https://ethereum.github.io/execution-apis/api-documentation/
 */
enum RPC_METHODS {
    /**
     * STATUS:
     * * Implemented in web3-providers-connex: True
     * * Required for hardhat: True -> @see https://github.com/vechain/vechain-sdk/issues/462
     * * Possible to implement: True (Already implemented in web3-providers-connex)
     */
    eth_blockNumber = 'eth_blockNumber',
    eth_chainId = 'eth_chainId',
    eth_getBalance = 'eth_getBalance',
    eth_getCode = 'eth_getCode',
    eth_getStorageAt = 'eth_getStorageAt',
    eth_estimateGas = 'eth_estimateGas',
    eth_call = 'eth_call',
    eth_sendRawTransaction = 'eth_sendRawTransaction',
    eth_getLogs = 'eth_getLogs',
    eth_getBlockByHash = 'eth_getBlockByHash',
    eth_getBlockByNumber = 'eth_getBlockByNumber',
    eth_accounts = 'eth_accounts',
    eth_requestAccounts = 'eth_requestAccounts',

    /**
     * STATUS:
     * * Implemented in web3-providers-connex: True
     * * Required for hardhat: False (BUT WE MUST INVESTIGATE BETTER) -> @see https://github.com/vechain/vechain-sdk/issues/462
     * * Possible to implement: True (Already implemented in web3-providers-connex)
     */
    eth_gasPrice = 'eth_gasPrice',
    eth_getTransactionByHash = 'eth_getTransactionByHash',
    eth_getTransactionCount = 'eth_getTransactionCount',
    eth_getTransactionReceipt = 'eth_getTransactionReceipt',
    eth_sendTransaction = 'eth_sendTransaction',
    eth_syncing = 'eth_syncing',
    net_version = 'net_version',
    web3_clientVersion = 'web3_clientVersion',
    eth_subscribe = 'eth_subscribe',
    eth_unsubscribe = 'eth_unsubscribe',
    debug_traceTransaction = 'debug_traceTransaction',
    debug_traceCall = 'debug_traceCall',
    evm_mine = 'evm_mine',

    /**
     * STATUS:
     * * Implemented in web3-providers-connex: False (ONLY LISTED `EthJsonRpcMethods`array in `src/common.ts` file)
     * * Required for hardhat: False -> @see https://github.com/vechain/vechain-sdk/issues/462
     * * Possible to implement: TO UNDERSTAND
     */
    eth_coinbase = 'eth_coinbase',
    eth_feeHistory = 'eth_feeHistory',
    eth_getBlockTransactionCountByHash = 'eth_getBlockTransactionCountByHash',
    eth_getBlockTransactionCountByNumber = 'eth_getBlockTransactionCountByNumber',
    eth_getTransactionByBlockHashAndIndex = 'eth_getTransactionByBlockHashAndIndex',
    eth_getTransactionByBlockNumberAndIndex = 'eth_getTransactionByBlockNumberAndIndex',
    eth_getUncleByBlockHashAndIndex = 'eth_getUncleByBlockHashAndIndex',
    eth_getUncleByBlockNumberAndIndex = 'eth_getUncleByBlockNumberAndIndex',
    eth_getUncleCountByBlockHash = 'eth_getUncleCountByBlockHash',
    eth_getUncleCountByBlockNumber = 'eth_getUncleCountByBlockNumber',
    eth_getWork = 'eth_getWork',
    eth_mining = 'eth_mining',
    eth_hashrate = 'eth_hashrate',
    eth_protocolVersion = 'eth_protocolVersion',
    eth_sign = 'eth_sign',
    eth_submitWork = 'eth_submitWork',
    net_listening = 'net_listening',
    net_peerCount = 'net_peerCount',
    parity_nextNonce = 'parity_nextNonce',
    eth_newFilter = 'eth_newFilter',
    eth_newBlockFilter = 'eth_newBlockFilter',
    eth_newPendingTransactionFilter = 'eth_newPendingTransactionFilter',
    eth_getFilterLogs = 'eth_getFilterLogs',
    eth_getFilterChanges = 'eth_getFilterChanges',
    eth_uninstallFilter = 'eth_uninstallFilter',

    /**
     * STATUS:
     * * Implemented in web3-providers-connex: False (AND NOT LISTED in `EthJsonRpcMethods`array in `src/common.ts` file. Probably NEW methods)
     * * Required for hardhat: False (BUT WE MUST INVESTIGATE IT BETTER) -> @see https://github.com/vechain/vechain-sdk/issues/462
     * * Possible to implement: TO UNDERSTAND
     *
     * @note: These methods are taken from https://ethereum.github.io/execution-apis/api-documentation/
     */
    debug_getBadBlocks = 'debug_getBadBlocks',
    debug_getRawBlock = 'debug_getRawBlock',
    debug_getRawHeader = 'debug_getRawHeader',
    debug_getRawReceipts = 'debug_getRawReceipts',
    debug_getRawTransaction = 'debug_getRawTransaction',
    engine_exchangeCapabilities = 'engine_exchangeCapabilities',
    engine_exchangeTransitionConfigurationV1 = 'engine_exchangeTransitionConfigurationV1',
    engine_forkchoiceUpdatedV1 = 'engine_forkchoiceUpdatedV1',
    engine_forkchoiceUpdatedV2 = 'engine_forkchoiceUpdatedV2',
    engine_forkchoiceUpdatedV3 = 'engine_forkchoiceUpdatedV3',
    engine_getPayloadBodiesByHashV1 = 'engine_getPayloadBodiesByHashV1',
    engine_getPayloadBodiesByRangeV1 = 'engine_getPayloadBodiesByRangeV1',
    engine_getPayloadV1 = 'engine_getPayloadV1',
    engine_getPayloadV2 = 'engine_getPayloadV2',
    engine_getPayloadV3 = 'engine_getPayloadV3',
    engine_newPayloadV1 = 'engine_newPayloadV1',
    engine_newPayloadV2 = 'engine_newPayloadV2',
    engine_newPayloadV3 = 'engine_newPayloadV3',
    eth_createAccessList = 'eth_createAccessList',
    eth_getBlockReceipts = 'eth_getBlockReceipts',
    eth_getProof = 'eth_getProof',
    eth_maxPriorityFeePerGas = 'eth_maxPriorityFeePerGas',
    eth_signTransaction = 'eth_signTransaction'
}

export { RPC_METHODS };
