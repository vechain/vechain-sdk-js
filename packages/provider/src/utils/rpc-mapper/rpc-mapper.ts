import { type ThorClient } from '@vechain/vechain-sdk-network';
import { type MethodHandlerType } from './types';
import {
    ethGetTransactionByHash,
    ethGetBlockByNumber,
    ethBlockNumber,
    ethChainId,
    ethGetBalance,
    ethGetCode,
    ethGetStorageAt,
    ethEstimateGas,
    ethCall,
    ethSendRawTransaction,
    ethGetLogs,
    ethGetBlockByHash,
    ethAccounts,
    ethGasPrice,
    ethGetTransactionCount,
    ethGetTransactionReceipt,
    ethSendTransaction,
    ethSyncing,
    netVersion,
    web3ClientVersion,
    ethSubscribe,
    ethUnsubscribe,
    debugTraceTransaction,
    debugTraceCall,
    evmMine,
    ethCoinbase,
    ethFeeHistory,
    ethGetBlockTransactionCountByHash,
    ethGetBlockTransactionCountByNumber,
    ethGetTransactionByBlockHashAndIndex,
    ethGetTransactionByBlockNumberAndIndex,
    ethGetUncleByBlockHashAndIndex,
    ethGetUncleByBlockNumberAndIndex,
    ethGetUncleCountByBlockHash,
    ethGetUncleCountByBlockNumber,
    ethGetWork,
    ethMining,
    ethHashrate,
    ethProtocolVersion,
    ethSign,
    ethSubmitWork,
    parityNextNonce,
    netPeerCount,
    netListening,
    ethNewFilter,
    ethNewBlockFilter,
    ethNewPendingTransactionFilter,
    ethGetFilterLogs,
    ethGetFilterChanges,
    ethUninstallFilter,
    debugGetBadBlocks,
    debugGetRawBlock,
    debugGetRawHeader,
    debugGetRawReceipts,
    debugGetRawTransaction,
    engineExchangeCapabilities,
    engineExchangeTransitionConfigurationV1,
    ethSignTransaction,
    ethMaxPriorityFeePerGas,
    ethGetProof,
    ethGetBlockReceipts,
    ethCreateAccessList,
    engineNewPayloadV3,
    engineNewPayloadV2,
    engineNewPayloadV1,
    engineGetPayloadV2,
    engineGetPayloadV3,
    engineGetPayloadV1,
    engineGetPayloadBodiesByRangeV1,
    engineGetPayloadBodiesByHashV1,
    engineForkchoiceUpdatedV3,
    engineForkchoiceUpdatedV2,
    engineForkchoiceUpdatedV1
} from './methods-map';
import { RPC_METHODS } from '../const';

/**
 * Map of RPC methods to their implementations with our SDK.
 * We can consider this as a "RPC Mapper" for our SDK.
 *
 * List of all RPC methods:
 * * https://eth.wiki/json-rpc/API
 * * https://ethereum.github.io/execution-apis/api-documentation/
 *
 * ------ TEMPORARY COMMENT ------
 * We cannot complete all the RPC methods in this PR!
 * ------------------------------
 */
const RPCMethodsMap = (
    thorClient: ThorClient
): Record<string, MethodHandlerType<unknown, unknown>> => {
    /**
     * Returns a map of RPC methods to their implementations with our SDK.
     */
    return {
        /**
         * RPC Method eth_blockNumber implementation
         * @returns the current block number the client is on.
         */
        [RPC_METHODS.eth_blockNumber]: async () => {
            return await ethBlockNumber(thorClient);
        },

        /**
         * RPC Method eth_chainId implementation
         * @returns the current chain id the client is on.
         */
        [RPC_METHODS.eth_chainId]: async () => {
            return await ethChainId(thorClient);
        },

        /**
         * RPC Method eth_getBalance implementation
         * @param params - The standard array of rpc call parameters.
         * @returns the balance of the account of given address.
         */
        [RPC_METHODS.eth_getBalance]: async (params) => {
            return await ethGetBalance(thorClient, params);
        },

        /**
         * RPC Method eth_getCode implementation
         * @param params - The standard array of rpc call parameters.
         * @returns the code of the account at the given address.
         */
        [RPC_METHODS.eth_getCode]: async (params) => {
            return await ethGetCode(thorClient, params);
        },

        /**
         * RPC Method eth_getStorageAt implementation
         * @param params - The standard array of rpc call parameters.
         * @returns the value from a storage position at a given address.
         */
        [RPC_METHODS.eth_getStorageAt]: async (params) => {
            return await ethGetStorageAt(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_estimateGas]: async (params) => {
            await ethEstimateGas(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_call]: async (params) => {
            await ethCall(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_sendRawTransaction]: async (params) => {
            await ethSendRawTransaction(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_getLogs]: async (params) => {
            await ethGetLogs(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_getBlockByHash]: async (params) => {
            await ethGetBlockByHash(thorClient, params);
        },

        /**
         * RPC Method eth_getBlockByNumber implementation
         *
         * @param params - The standard array of rpc call parameters.
         * @returns the block with the given number formatted to the RPC standard.
         */
        [RPC_METHODS.eth_getBlockByNumber]: async (params) => {
            return await ethGetBlockByNumber(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_accounts]: async (params) => {
            await ethAccounts(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_gasPrice]: async (params) => {
            await ethGasPrice(thorClient, params);
        },

        /**
         * RPC Method eth_getTransactionByHash implementation
         * @param params - The standard array of rpc call parameters.
         * @returns the transaction with the given hash formatted to the RPC standard.
         */
        [RPC_METHODS.eth_getTransactionByHash]: async (params) => {
            return await ethGetTransactionByHash(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_getTransactionCount]: async (params) => {
            await ethGetTransactionCount(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_getTransactionReceipt]: async (params) => {
            await ethGetTransactionReceipt(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_sendTransaction]: async (params) => {
            await ethSendTransaction(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_syncing]: async (params) => {
            await ethSyncing(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.net_version]: async (params) => {
            await netVersion(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.web3_clientVersion]: async (params) => {
            await web3ClientVersion(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_subscribe]: async (params) => {
            await ethSubscribe(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_unsubscribe]: async (params) => {
            await ethUnsubscribe(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.debug_traceTransaction]: async (params) => {
            await debugTraceTransaction(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.debug_traceCall]: async (params) => {
            await debugTraceCall(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.evm_mine]: async (params) => {
            await evmMine(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_coinbase]: async (params) => {
            await ethCoinbase(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_feeHistory]: async (params) => {
            await ethFeeHistory(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_getBlockTransactionCountByHash]: async (params) => {
            await ethGetBlockTransactionCountByHash(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_getBlockTransactionCountByNumber]: async (params) => {
            await ethGetBlockTransactionCountByNumber(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_getTransactionByBlockHashAndIndex]: async (params) => {
            await ethGetTransactionByBlockHashAndIndex(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_getTransactionByBlockNumberAndIndex]: async (
            params
        ) => {
            await ethGetTransactionByBlockNumberAndIndex(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_getUncleByBlockHashAndIndex]: async (params) => {
            await ethGetUncleByBlockHashAndIndex(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_getUncleByBlockNumberAndIndex]: async (params) => {
            await ethGetUncleByBlockNumberAndIndex(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_getUncleCountByBlockHash]: async (params) => {
            await ethGetUncleCountByBlockHash(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_getUncleCountByBlockNumber]: async (params) => {
            await ethGetUncleCountByBlockNumber(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_getWork]: async (params) => {
            await ethGetWork(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_mining]: async (params) => {
            await ethMining(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_hashrate]: async (params) => {
            await ethHashrate(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_protocolVersion]: async (params) => {
            await ethProtocolVersion(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_sign]: async (params) => {
            await ethSign(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_submitWork]: async (params) => {
            await ethSubmitWork(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.net_listening]: async (params) => {
            await netListening(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.net_peerCount]: async (params) => {
            await netPeerCount(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.parity_nextNonce]: async (params) => {
            await parityNextNonce(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_newFilter]: async (params) => {
            await ethNewFilter(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_newBlockFilter]: async (params) => {
            await ethNewBlockFilter(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_newPendingTransactionFilter]: async (params) => {
            await ethNewPendingTransactionFilter(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_getFilterLogs]: async (params) => {
            await ethGetFilterLogs(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_getFilterChanges]: async (params) => {
            await ethGetFilterChanges(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_uninstallFilter]: async (params) => {
            await ethUninstallFilter(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.debug_getBadBlocks]: async (params) => {
            await debugGetBadBlocks(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.debug_getRawBlock]: async (params) => {
            await debugGetRawBlock(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.debug_getRawHeader]: async (params) => {
            await debugGetRawHeader(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.debug_getRawReceipts]: async (params) => {
            await debugGetRawReceipts(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.debug_getRawTransaction]: async (params) => {
            await debugGetRawTransaction(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.engine_exchangeCapabilities]: async (params) => {
            await engineExchangeCapabilities(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.engine_exchangeTransitionConfigurationV1]: async (
            params
        ) => {
            await engineExchangeTransitionConfigurationV1(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.engine_forkchoiceUpdatedV1]: async (params) => {
            await engineForkchoiceUpdatedV1(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.engine_forkchoiceUpdatedV2]: async (params) => {
            await engineForkchoiceUpdatedV2(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.engine_forkchoiceUpdatedV3]: async (params) => {
            await engineForkchoiceUpdatedV3(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.engine_getPayloadBodiesByHashV1]: async (params) => {
            await engineGetPayloadBodiesByHashV1(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.engine_getPayloadBodiesByRangeV1]: async (params) => {
            await engineGetPayloadBodiesByRangeV1(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.engine_getPayloadV1]: async (params) => {
            await engineGetPayloadV1(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.engine_getPayloadV2]: async (params) => {
            await engineGetPayloadV2(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.engine_getPayloadV3]: async (params) => {
            await engineGetPayloadV3(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.engine_newPayloadV1]: async (params) => {
            await engineNewPayloadV1(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.engine_newPayloadV2]: async (params) => {
            await engineNewPayloadV2(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.engine_newPayloadV3]: async (params) => {
            await engineNewPayloadV3(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_createAccessList]: async (params) => {
            await ethCreateAccessList(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_getBlockReceipts]: async (params) => {
            await ethGetBlockReceipts(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_getProof]: async (params) => {
            await ethGetProof(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_maxPriorityFeePerGas]: async (params) => {
            await ethMaxPriorityFeePerGas(thorClient, params);
        },

        /**
         * ... RPC Method DOC ...
         */
        [RPC_METHODS.eth_signTransaction]: async (params) => {
            await ethSignTransaction(thorClient, params);
        }
    };
};

export { RPCMethodsMap };
