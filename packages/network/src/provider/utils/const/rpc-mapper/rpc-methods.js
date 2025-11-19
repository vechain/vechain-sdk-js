"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPC_METHODS = void 0;
/**
 * List of all valid ethereum RPC methods
 *
 * @note following links for more details:
 * * https://eth.wiki/json-rpc/API
 * * https://ethereum.github.io/execution-apis/api-documentation/
 */
var RPC_METHODS;
(function (RPC_METHODS) {
    /**
     * IMPLEMENTED METHODS:
     */
    RPC_METHODS["eth_blockNumber"] = "eth_blockNumber";
    RPC_METHODS["eth_chainId"] = "eth_chainId";
    RPC_METHODS["eth_getBalance"] = "eth_getBalance";
    RPC_METHODS["eth_getCode"] = "eth_getCode";
    RPC_METHODS["eth_getStorageAt"] = "eth_getStorageAt";
    RPC_METHODS["eth_estimateGas"] = "eth_estimateGas";
    RPC_METHODS["eth_call"] = "eth_call";
    RPC_METHODS["eth_sendRawTransaction"] = "eth_sendRawTransaction";
    RPC_METHODS["eth_getLogs"] = "eth_getLogs";
    RPC_METHODS["eth_getBlockByHash"] = "eth_getBlockByHash";
    RPC_METHODS["eth_getBlockByNumber"] = "eth_getBlockByNumber";
    RPC_METHODS["eth_accounts"] = "eth_accounts";
    RPC_METHODS["eth_requestAccounts"] = "eth_requestAccounts";
    RPC_METHODS["eth_gasPrice"] = "eth_gasPrice";
    RPC_METHODS["eth_getTransactionByHash"] = "eth_getTransactionByHash";
    RPC_METHODS["eth_getTransactionCount"] = "eth_getTransactionCount";
    RPC_METHODS["eth_getTransactionReceipt"] = "eth_getTransactionReceipt";
    RPC_METHODS["eth_getTransactionByBlockNumberAndIndex"] = "eth_getTransactionByBlockNumberAndIndex";
    RPC_METHODS["eth_getTransactionByBlockHashAndIndex"] = "eth_getTransactionByBlockHashAndIndex";
    RPC_METHODS["eth_getBlockTransactionCountByHash"] = "eth_getBlockTransactionCountByHash";
    RPC_METHODS["eth_getBlockTransactionCountByNumber"] = "eth_getBlockTransactionCountByNumber";
    RPC_METHODS["eth_sendTransaction"] = "eth_sendTransaction";
    RPC_METHODS["eth_syncing"] = "eth_syncing";
    RPC_METHODS["net_version"] = "net_version";
    RPC_METHODS["web3_clientVersion"] = "web3_clientVersion";
    RPC_METHODS["eth_subscribe"] = "eth_subscribe";
    RPC_METHODS["eth_unsubscribe"] = "eth_unsubscribe";
    RPC_METHODS["debug_traceTransaction"] = "debug_traceTransaction";
    RPC_METHODS["debug_traceCall"] = "debug_traceCall";
    RPC_METHODS["evm_mine"] = "evm_mine";
    RPC_METHODS["evm_increaseTime"] = "evm_increaseTime";
    RPC_METHODS["web3_sha3"] = "web3_sha3";
    RPC_METHODS["net_peerCount"] = "net_peerCount";
    RPC_METHODS["net_listening"] = "net_listening";
    RPC_METHODS["eth_getUncleByBlockNumberAndIndex"] = "eth_getUncleByBlockNumberAndIndex";
    RPC_METHODS["eth_getUncleByBlockHashAndIndex"] = "eth_getUncleByBlockHashAndIndex";
    RPC_METHODS["txpool_inspect"] = "txpool_inspect";
    RPC_METHODS["txpool_contentFrom"] = "txpool_contentFrom";
    RPC_METHODS["txpool_content"] = "txpool_content";
    RPC_METHODS["txpool_status"] = "txpool_status";
    RPC_METHODS["eth_signTransaction"] = "eth_signTransaction";
    RPC_METHODS["debug_traceBlockByHash"] = "debug_traceBlockByHash";
    RPC_METHODS["debug_traceBlockByNumber"] = "debug_traceBlockByNumber";
    RPC_METHODS["eth_getUncleCountByBlockHash"] = "eth_getUncleCountByBlockHash";
    RPC_METHODS["eth_getUncleCountByBlockNumber"] = "eth_getUncleCountByBlockNumber";
    RPC_METHODS["eth_signTypedData_v4"] = "eth_signTypedData_v4";
    RPC_METHODS["eth_getBlockReceipts"] = "eth_getBlockReceipts";
    /**
     * TO BE IMPLEMENTED METHODS:
     * Add to packages/network/src/provider/utils/rpc-mapper/methods/index.ts to implement
     */
    RPC_METHODS["eth_coinbase"] = "eth_coinbase";
    RPC_METHODS["eth_feeHistory"] = "eth_feeHistory";
    RPC_METHODS["eth_getWork"] = "eth_getWork";
    RPC_METHODS["eth_mining"] = "eth_mining";
    RPC_METHODS["eth_hashrate"] = "eth_hashrate";
    RPC_METHODS["eth_protocolVersion"] = "eth_protocolVersion";
    RPC_METHODS["eth_sign"] = "eth_sign";
    RPC_METHODS["eth_submitWork"] = "eth_submitWork";
    RPC_METHODS["parity_nextNonce"] = "parity_nextNonce";
    RPC_METHODS["eth_newFilter"] = "eth_newFilter";
    RPC_METHODS["eth_newBlockFilter"] = "eth_newBlockFilter";
    RPC_METHODS["eth_newPendingTransactionFilter"] = "eth_newPendingTransactionFilter";
    RPC_METHODS["eth_getFilterLogs"] = "eth_getFilterLogs";
    RPC_METHODS["eth_getFilterChanges"] = "eth_getFilterChanges";
    RPC_METHODS["eth_uninstallFilter"] = "eth_uninstallFilter";
    RPC_METHODS["debug_getBadBlocks"] = "debug_getBadBlocks";
    RPC_METHODS["debug_getRawBlock"] = "debug_getRawBlock";
    RPC_METHODS["debug_getRawHeader"] = "debug_getRawHeader";
    RPC_METHODS["debug_getRawReceipts"] = "debug_getRawReceipts";
    RPC_METHODS["debug_getRawTransaction"] = "debug_getRawTransaction";
    RPC_METHODS["engine_exchangeCapabilities"] = "engine_exchangeCapabilities";
    RPC_METHODS["engine_exchangeTransitionConfigurationV1"] = "engine_exchangeTransitionConfigurationV1";
    RPC_METHODS["engine_forkchoiceUpdatedV1"] = "engine_forkchoiceUpdatedV1";
    RPC_METHODS["engine_forkchoiceUpdatedV2"] = "engine_forkchoiceUpdatedV2";
    RPC_METHODS["engine_forkchoiceUpdatedV3"] = "engine_forkchoiceUpdatedV3";
    RPC_METHODS["engine_getPayloadBodiesByHashV1"] = "engine_getPayloadBodiesByHashV1";
    RPC_METHODS["engine_getPayloadBodiesByRangeV1"] = "engine_getPayloadBodiesByRangeV1";
    RPC_METHODS["engine_getPayloadV1"] = "engine_getPayloadV1";
    RPC_METHODS["engine_getPayloadV2"] = "engine_getPayloadV2";
    RPC_METHODS["engine_getPayloadV3"] = "engine_getPayloadV3";
    RPC_METHODS["engine_newPayloadV1"] = "engine_newPayloadV1";
    RPC_METHODS["engine_newPayloadV2"] = "engine_newPayloadV2";
    RPC_METHODS["engine_newPayloadV3"] = "engine_newPayloadV3";
    RPC_METHODS["eth_createAccessList"] = "eth_createAccessList";
    RPC_METHODS["eth_getProof"] = "eth_getProof";
    RPC_METHODS["eth_maxPriorityFeePerGas"] = "eth_maxPriorityFeePerGas";
})(RPC_METHODS || (exports.RPC_METHODS = RPC_METHODS = {}));
