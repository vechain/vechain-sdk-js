/**
 * List of all valid ethereum RPC methods
 *
 * @note following links for more details:
 * * https://eth.wiki/json-rpc/API
 * * https://ethereum.github.io/execution-apis/api-documentation/
 */
enum RPC_METHODS {
    eth_accounts = 'eth_accounts',
    eth_blockNumber = 'eth_blockNumber',
    eth_call = 'eth_call',
    eth_chainId = 'eth_chainId',
    eth_coinbase = 'eth_coinbase',
    eth_estimateGas = 'eth_estimateGas',
    eth_feeHistory = 'eth_feeHistory',
    eth_gasPrice = 'eth_gasPrice',
    eth_getBalance = 'eth_getBalance',
    eth_getBlockByHash = 'eth_getBlockByHash',
    eth_getBlockByNumber = 'eth_getBlockByNumber',
    eth_getBlockTransactionCountByHash = 'eth_getBlockTransactionCountByHash',
    eth_getBlockTransactionCountByNumber = 'eth_getBlockTransactionCountByNumber',
    eth_getCode = 'eth_getCode',
    eth_getLogs = 'eth_getLogs',
    eth_getStorageAt = 'eth_getStorageAt',
    eth_getTransactionByBlockHashAndIndex = 'eth_getTransactionByBlockHashAndIndex',
    eth_getTransactionByBlockNumberAndIndex = 'eth_getTransactionByBlockNumberAndIndex',
    eth_getTransactionByHash = 'eth_getTransactionByHash',
    eth_getTransactionCount = 'eth_getTransactionCount',
    eth_getTransactionReceipt = 'eth_getTransactionReceipt',
    eth_getUncleByBlockHashAndIndex = 'eth_getUncleByBlockHashAndIndex',
    eth_getUncleByBlockNumberAndIndex = 'eth_getUncleByBlockNumberAndIndex',
    eth_getUncleCountByBlockHash = 'eth_getUncleCountByBlockHash',
    eth_getUncleCountByBlockNumber = 'eth_getUncleCountByBlockNumber',
    eth_getWork = 'eth_getWork',
    eth_mining = 'eth_mining',
    eth_hashrate = 'eth_hashrate',
    eth_protocolVersion = 'eth_protocolVersion',
    eth_sendTransaction = 'eth_sendTransaction',
    eth_sendRawTransaction = 'eth_sendRawTransaction',
    eth_sign = 'eth_sign',
    eth_submitWork = 'eth_submitWork',
    eth_syncing = 'eth_syncing',
    net_listening = 'net_listening',
    net_peerCount = 'net_peerCount',
    net_version = 'net_version',
    parity_nextNonce = 'parity_nextNonce',
    web3_clientVersion = 'web3_clientVersion',
    eth_newFilter = 'eth_newFilter',
    eth_newBlockFilter = 'eth_newBlockFilter',
    eth_newPendingTransactionFilter = 'eth_newPendingTransactionFilter',
    eth_getFilterLogs = 'eth_getFilterLogs',
    eth_getFilterChanges = 'eth_getFilterChanges',
    eth_uninstallFilter = 'eth_uninstallFilter',
    eth_subscribe = 'eth_subscribe',
    eth_unsubscribe = 'eth_unsubscribe',

    debug_traceTransaction = 'debug_traceTransaction',
    debug_traceCall = 'debug_traceCall',

    evm_mine = 'evm_mine'
}

export { RPC_METHODS };
