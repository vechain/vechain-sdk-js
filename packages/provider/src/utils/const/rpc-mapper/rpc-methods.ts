/**
 * List of all valid ethereum RPC methods
 *
 * @note following links for more details:
 * * https://eth.wiki/json-rpc/API
 * * https://ethereum.github.io/execution-apis/api-documentation/
 */
enum RPC_METHODS {
    /**
     * ----- TEMPORARY COMMENT -----
     * STATUS:
     * * Implemented in web3-providers-connex: True
     * * Required for hardhat: True -> @see https://github.com/vechain/vechain-sdk/issues/462
     * * Possible to implement: True (Already implemented in web3-providers-connex)
     *
     * @PRIORITY: HIGH
     * -----------------------------
     */
    eth_blockNumber = 'eth_blockNumber',
    eth_chainId = 'eth_chainId',
    eth_getBalance = 'eth_getBalance',
    eth_getCode = 'eth_getCode',
    eth_getStorageAt = 'eth_getStorageAt',
    eth_estimateGas = 'eth_estimateGas',
    eth_call = 'eth_call',
    eth_sendRawTransaction = 'eth_sendRawTransaction',
    eth_getLogs = 'eth_getLogs', // TEMPORARY COMMENT - TO IMPLEMENT
    eth_getBlockByHash = 'eth_getBlockByHash',
    eth_getBlockByNumber = 'eth_getBlockByNumber',
    eth_accounts = 'eth_accounts', // TEMPORARY COMMENT - TO IMPLEMENT (WALLET NEEDED)

    /**
     * ----- TEMPORARY COMMENT -----
     * STATUS:
     * * Implemented in web3-providers-connex: True
     * * Required for hardhat: False (BUT WE MUST INVESTIGATE BETTER) -> @see https://github.com/vechain/vechain-sdk/issues/462
     * * Possible to implement: True (Already implemented in web3-providers-connex)
     *
     * @PRIORITY: HIGH
     * -----------------------------
     */
    eth_gasPrice = 'eth_gasPrice', // TEMPORARY COMMENT - IMPLEMENTED (Understand only if 0x is ok, or we have other alternatives)
    eth_getTransactionByHash = 'eth_getTransactionByHash',
    eth_getTransactionCount = 'eth_getTransactionCount', // TEMPORARY COMMENT - IMPLEMENTED (Understand only if count is better, instead of nonce)
    eth_getTransactionReceipt = 'eth_getTransactionReceipt',
    eth_sendTransaction = 'eth_sendTransaction', // TEMPORARY COMMENT - TO IMPLEMENT
    eth_syncing = 'eth_syncing', // TEMPORARY COMMENT - TO IMPLEMENT
    net_version = 'net_version',
    web3_clientVersion = 'web3_clientVersion', // TEMPORARY COMMENT -IMPLEMENTED (Better understand if 'thor' is ok)
    eth_subscribe = 'eth_subscribe', // TEMPORARY COMMENT - TO IMPLEMENT
    eth_unsubscribe = 'eth_unsubscribe', // TEMPORARY COMMENT - TO IMPLEMENT
    debug_traceTransaction = 'debug_traceTransaction', // TEMPORARY COMMENT - TO IMPLEMENT
    debug_traceCall = 'debug_traceCall', // TEMPORARY COMMENT - TO IMPLEMENT
    evm_mine = 'evm_mine',

    /**
     * ----- TEMPORARY COMMENT -----
     * STATUS:
     * * Implemented in web3-providers-connex: False (ONLY LISTED `EthJsonRpcMethods`array in `src/common.ts` file)
     * * Required for hardhat: False -> @see https://github.com/vechain/vechain-sdk/issues/462
     * * Possible to implement: TO UNDERSTAND
     *
     * @PRIORITY: MEDIUM (SEE AFTER FIRST TWO BLOCKS OF FUNCTIONS)
     * -----------------------------
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
     * ----- TEMPORARY COMMENT -----
     * STATUS:
     * * Implemented in web3-provviders-connex: False (AND NOT LISTED in `EthJsonRpcMethods`array in `src/common.ts` file. Probably NEW methods)
     * * Required for hardhat: False (BUT WE MUST INVESTIGATE IT BETTER) -> @see https://github.com/vechain/vechain-sdk/issues/462
     * * Possible to implement: TO UNDERSTAND
     *
     * @note: These methods are taken from https://ethereum.github.io/execution-apis/api-documentation/
     *
     * @PRIORITY: LOW (Probably not needed)
     * -----------------------------
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
