"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPCMethodsMap = void 0;
const rpc_methods_1 = require("../const/rpc-mapper/rpc-methods");
const methods_1 = require("./methods");
const eth_feeHistory_1 = require("./methods/eth_feeHistory/eth_feeHistory");
const eth_maxPriorityFeePerGas_1 = require("./methods/eth_maxPriorityFeePerGas/eth_maxPriorityFeePerGas");
/**
 * Map of RPC methods to their implementations with the SDK.
 * We can consider this as an "RPC Mapper" for the SDK.
 *
 * List of all RPC methods:
 * * https://eth.wiki/json-rpc/API
 * * https://ethereum.github.io/execution-apis/api-documentation/
 *
 * @param thorClient - ThorClient instance.
 * @param provider - Provider instance. It is optional because the majority of the methods do not require a provider.
 */
const RPCMethodsMap = (thorClient, provider) => {
    /**
     * Returns a map of RPC methods to their implementations with our SDK.
     */
    return {
        [rpc_methods_1.RPC_METHODS.eth_blockNumber]: async () => {
            return await (0, methods_1.ethBlockNumber)(thorClient);
        },
        [rpc_methods_1.RPC_METHODS.eth_chainId]: async () => {
            return await (0, methods_1.ethChainId)(thorClient);
        },
        [rpc_methods_1.RPC_METHODS.eth_getBalance]: async (params) => {
            return await (0, methods_1.ethGetBalance)(thorClient, params);
        },
        [rpc_methods_1.RPC_METHODS.eth_getCode]: async (params) => {
            return await (0, methods_1.ethGetCode)(thorClient, params);
        },
        [rpc_methods_1.RPC_METHODS.eth_getStorageAt]: async (params) => {
            return await (0, methods_1.ethGetStorageAt)(thorClient, params);
        },
        [rpc_methods_1.RPC_METHODS.eth_estimateGas]: async (params) => {
            return await (0, methods_1.ethEstimateGas)(thorClient, params);
        },
        [rpc_methods_1.RPC_METHODS.eth_call]: async (params) => {
            return await (0, methods_1.ethCall)(thorClient, params);
        },
        [rpc_methods_1.RPC_METHODS.eth_sendRawTransaction]: async (params) => {
            return await (0, methods_1.ethSendRawTransaction)(thorClient, params);
        },
        [rpc_methods_1.RPC_METHODS.eth_getLogs]: async (params) => {
            return await (0, methods_1.ethGetLogs)(thorClient, params);
        },
        [rpc_methods_1.RPC_METHODS.eth_getBlockByHash]: async (params) => {
            return await (0, methods_1.ethGetBlockByHash)(thorClient, params);
        },
        [rpc_methods_1.RPC_METHODS.eth_getBlockByNumber]: async (params) => {
            return await (0, methods_1.ethGetBlockByNumber)(thorClient, params);
        },
        [rpc_methods_1.RPC_METHODS.eth_accounts]: async () => {
            return await (0, methods_1.ethAccounts)(provider);
        },
        [rpc_methods_1.RPC_METHODS.eth_gasPrice]: async () => {
            return await (0, methods_1.ethGasPrice)(thorClient);
        },
        [rpc_methods_1.RPC_METHODS.eth_getTransactionByHash]: async (params) => {
            return await (0, methods_1.ethGetTransactionByHash)(thorClient, params);
        },
        [rpc_methods_1.RPC_METHODS.eth_getTransactionCount]: async (params) => {
            return await (0, methods_1.ethGetTransactionCount)(params);
        },
        [rpc_methods_1.RPC_METHODS.eth_getTransactionReceipt]: async (params) => {
            return await (0, methods_1.ethGetTransactionReceipt)(thorClient, params);
        },
        [rpc_methods_1.RPC_METHODS.eth_sendTransaction]: async (params) => {
            return await (0, methods_1.ethSendTransaction)(thorClient, params, provider);
        },
        [rpc_methods_1.RPC_METHODS.eth_syncing]: async () => {
            return await (0, methods_1.ethSyncing)(thorClient);
        },
        [rpc_methods_1.RPC_METHODS.net_version]: async () => {
            return await (0, methods_1.netVersion)(thorClient);
        },
        [rpc_methods_1.RPC_METHODS.web3_clientVersion]: async () => {
            return await (0, methods_1.web3ClientVersion)();
        },
        [rpc_methods_1.RPC_METHODS.eth_subscribe]: async (params) => {
            return await (0, methods_1.ethSubscribe)(thorClient, params, provider);
        },
        [rpc_methods_1.RPC_METHODS.eth_unsubscribe]: async (params) => {
            return await (0, methods_1.ethUnsubscribe)(params, provider);
        },
        [rpc_methods_1.RPC_METHODS.debug_traceTransaction]: async (params) => {
            return await (0, methods_1.debugTraceTransaction)(thorClient, params);
        },
        [rpc_methods_1.RPC_METHODS.debug_traceCall]: async (params) => {
            return await (0, methods_1.debugTraceCall)(thorClient, params);
        },
        [rpc_methods_1.RPC_METHODS.evm_increaseTime]: async () => {
            // @see https://docs.vechain.org/core-concepts/evm-compatibility/test-coverage/hardhat-specific/evm_increasetime
            // VeChain does not support evm_increaseTime, so we use evm_mine instead
            // This is a workaround to be able to use hardhat's evm_increaseTime
            return await (0, methods_1.evmMine)(thorClient);
        },
        [rpc_methods_1.RPC_METHODS.evm_mine]: async () => {
            return await (0, methods_1.evmMine)(thorClient);
        },
        [rpc_methods_1.RPC_METHODS.eth_getBlockTransactionCountByHash]: async (params) => {
            return await (0, methods_1.ethGetBlockTransactionCountByHash)(thorClient, params);
        },
        [rpc_methods_1.RPC_METHODS.eth_getBlockTransactionCountByNumber]: async (params) => {
            return await (0, methods_1.ethGetBlockTransactionCountByNumber)(thorClient, params);
        },
        [rpc_methods_1.RPC_METHODS.eth_getTransactionByBlockHashAndIndex]: async (params) => {
            return await (0, methods_1.ethGetTransactionByBlockHashAndIndex)(thorClient, params);
        },
        [rpc_methods_1.RPC_METHODS.eth_getTransactionByBlockNumberAndIndex]: async (params) => {
            return await (0, methods_1.ethGetTransactionByBlockNumberAndIndex)(thorClient, params);
        },
        [rpc_methods_1.RPC_METHODS.eth_getUncleByBlockHashAndIndex]: async (params) => {
            return await (0, methods_1.ethGetUncleByBlockHashAndIndex)(params);
        },
        [rpc_methods_1.RPC_METHODS.eth_getUncleByBlockNumberAndIndex]: async (params) => {
            return await (0, methods_1.ethGetUncleByBlockNumberAndIndex)(params);
        },
        [rpc_methods_1.RPC_METHODS.eth_getUncleCountByBlockHash]: async (params) => {
            return await (0, methods_1.ethGetUncleCountByBlockHash)(params);
        },
        [rpc_methods_1.RPC_METHODS.eth_getUncleCountByBlockNumber]: async (params) => {
            return await (0, methods_1.ethGetUncleCountByBlockNumber)(params);
        },
        [rpc_methods_1.RPC_METHODS.eth_requestAccounts]: async () => {
            return await (0, methods_1.ethRequestAccounts)(provider);
        },
        [rpc_methods_1.RPC_METHODS.net_listening]: async () => {
            return await (0, methods_1.netListening)(thorClient);
        },
        [rpc_methods_1.RPC_METHODS.net_peerCount]: async () => {
            return await (0, methods_1.netPeerCount)(thorClient);
        },
        [rpc_methods_1.RPC_METHODS.eth_getBlockReceipts]: async (params) => {
            return await (0, methods_1.ethGetBlockReceipts)(thorClient, params);
        },
        [rpc_methods_1.RPC_METHODS.eth_signTransaction]: async (params) => {
            return await (0, methods_1.ethSignTransaction)(thorClient, params, provider);
        },
        [rpc_methods_1.RPC_METHODS.web3_sha3]: async (params) => {
            return await (0, methods_1.web3Sha3)(params);
        },
        [rpc_methods_1.RPC_METHODS.txpool_inspect]: async () => {
            return await (0, methods_1.txPoolInspect)();
        },
        [rpc_methods_1.RPC_METHODS.txpool_content]: async () => {
            return await (0, methods_1.txPoolContent)();
        },
        [rpc_methods_1.RPC_METHODS.txpool_contentFrom]: async (params) => {
            return await (0, methods_1.txPoolContentFrom)(params);
        },
        [rpc_methods_1.RPC_METHODS.txpool_status]: async () => {
            return await (0, methods_1.txPoolStatus)();
        },
        [rpc_methods_1.RPC_METHODS.debug_traceBlockByHash]: async (params) => {
            return await (0, methods_1.debugTraceBlockByHash)(thorClient, params);
        },
        [rpc_methods_1.RPC_METHODS.debug_traceBlockByNumber]: async (params) => {
            return await (0, methods_1.debugTraceBlockByNumber)(thorClient, params);
        },
        [rpc_methods_1.RPC_METHODS.eth_signTypedData_v4]: async (params) => {
            return await (0, methods_1.ethSignTypedDataV4)(thorClient, params, provider);
        },
        [rpc_methods_1.RPC_METHODS.eth_maxPriorityFeePerGas]: async (params) => {
            return await (0, eth_maxPriorityFeePerGas_1.ethMaxPriorityFeePerGas)(thorClient, params, provider);
        },
        [rpc_methods_1.RPC_METHODS.eth_feeHistory]: async (params) => {
            return await (0, eth_feeHistory_1.ethFeeHistory)(thorClient, params, provider);
        }
    };
};
exports.RPCMethodsMap = RPCMethodsMap;
