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
    eth_getLogs = 'eth_getLogs',
    eth_getBlockByHash = 'eth_getBlockByHash',
    eth_getBlockByNumber = 'eth_getBlockByNumber',
    eth_accounts = 'eth_accounts',

    /**
     * ----- TEMPORARY COMMENT -----
     * STATUS:
     * * Implemented in web3-providers-connex: True
     * * Required for hardhat: False (BUT WE MUST INVESTIGATE BETTER) -> @see https://github.com/vechain/vechain-sdk/issues/462
     * * Possible to implement: True (Already implemented in web3-providers-connex)
     * -----------------------------
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
     * ----- TEMPORARY COMMENT -----
     * STATUS:
     * * Implemented in web3-providers-connex: False (IT IS ONLY LISTED `EthJsonRpcMethods`array in `src/common.ts` file)
     * * Required for hardhat: False -> @see https://github.com/vechain/vechain-sdk/issues/462
     * * Possible to implement: True (WE MUST IMPLEMENT IT :D)
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
    eth_uninstallFilter = 'eth_uninstallFilter'

    /**
     * ----- TEMPORARY COMMENT -----
     * STATUS:
     * * Implemented in web3-provviders-connex: False
     * * Required for hardhat: True -> @see https://github.com/vechain/vechain-sdk/issues/462
     * * Possible to implement: True (WE MUST IMPLEMENT IT :D)
     * -----------------------------
     */
}

export { RPC_METHODS };
