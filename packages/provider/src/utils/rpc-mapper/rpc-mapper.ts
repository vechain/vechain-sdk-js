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
import {
    type BlocksRPC,
    type TransactionReceiptRPC,
    type TransactionRPC
} from '../formatter';

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
        [RPC_METHODS.eth_blockNumber]: async (): Promise<string> => {
            return await ethBlockNumber(thorClient);
        },

        [RPC_METHODS.eth_chainId]: async (): Promise<string> => {
            return await ethChainId(thorClient);
        },

        [RPC_METHODS.eth_getBalance]: async (params): Promise<string> => {
            return await ethGetBalance(thorClient, params);
        },

        [RPC_METHODS.eth_getCode]: async (params): Promise<string> => {
            return await ethGetCode(thorClient, params);
        },

        [RPC_METHODS.eth_getStorageAt]: async (params): Promise<string> => {
            return await ethGetStorageAt(thorClient, params);
        },

        [RPC_METHODS.eth_estimateGas]: async (params) => {
            await ethEstimateGas(thorClient, params);
        },

        [RPC_METHODS.eth_call]: async (params) => {
            await ethCall(thorClient, params);
        },

        [RPC_METHODS.eth_sendRawTransaction]: async (params) => {
            await ethSendRawTransaction(thorClient, params);
        },

        [RPC_METHODS.eth_getLogs]: async (params) => {
            await ethGetLogs(thorClient, params);
        },

        [RPC_METHODS.eth_getBlockByHash]: async (params) => {
            await ethGetBlockByHash(thorClient, params);
        },

        [RPC_METHODS.eth_getBlockByNumber]: async (
            params
        ): Promise<BlocksRPC | null> => {
            return await ethGetBlockByNumber(thorClient, params);
        },

        [RPC_METHODS.eth_accounts]: async (params) => {
            await ethAccounts(thorClient, params);
        },

        [RPC_METHODS.eth_gasPrice]: async (): Promise<string> => {
            return await ethGasPrice();
        },

        [RPC_METHODS.eth_getTransactionByHash]: async (
            params
        ): Promise<TransactionRPC | null> => {
            return await ethGetTransactionByHash(thorClient, params);
        },

        [RPC_METHODS.eth_getTransactionCount]: async (
            params
        ): Promise<string> => {
            return await ethGetTransactionCount(params);
        },

        [RPC_METHODS.eth_getTransactionReceipt]: async (
            params
        ): Promise<TransactionReceiptRPC | null> => {
            return await ethGetTransactionReceipt(thorClient, params);
        },

        [RPC_METHODS.eth_sendTransaction]: async (params) => {
            await ethSendTransaction(thorClient, params);
        },

        [RPC_METHODS.eth_syncing]: async (params) => {
            await ethSyncing(thorClient, params);
        },

        [RPC_METHODS.net_version]: async (): Promise<string> => {
            return await netVersion(thorClient);
        },

        [RPC_METHODS.web3_clientVersion]: async (): Promise<string> => {
            return await web3ClientVersion();
        },

        [RPC_METHODS.eth_subscribe]: async (params) => {
            await ethSubscribe(thorClient, params);
        },

        [RPC_METHODS.eth_unsubscribe]: async (params) => {
            await ethUnsubscribe(thorClient, params);
        },

        [RPC_METHODS.debug_traceTransaction]: async (params) => {
            await debugTraceTransaction(thorClient, params);
        },

        [RPC_METHODS.debug_traceCall]: async (params) => {
            await debugTraceCall(thorClient, params);
        },

        [RPC_METHODS.evm_mine]: async (params) => {
            await evmMine(thorClient, params);
        },

        [RPC_METHODS.eth_coinbase]: async (params) => {
            await ethCoinbase(thorClient, params);
        },

        [RPC_METHODS.eth_feeHistory]: async (params) => {
            await ethFeeHistory(thorClient, params);
        },

        [RPC_METHODS.eth_getBlockTransactionCountByHash]: async (params) => {
            await ethGetBlockTransactionCountByHash(thorClient, params);
        },

        [RPC_METHODS.eth_getBlockTransactionCountByNumber]: async (params) => {
            await ethGetBlockTransactionCountByNumber(thorClient, params);
        },

        [RPC_METHODS.eth_getTransactionByBlockHashAndIndex]: async (params) => {
            await ethGetTransactionByBlockHashAndIndex(thorClient, params);
        },

        [RPC_METHODS.eth_getTransactionByBlockNumberAndIndex]: async (
            params
        ) => {
            await ethGetTransactionByBlockNumberAndIndex(thorClient, params);
        },

        [RPC_METHODS.eth_getUncleByBlockHashAndIndex]: async (params) => {
            await ethGetUncleByBlockHashAndIndex(thorClient, params);
        },

        [RPC_METHODS.eth_getUncleByBlockNumberAndIndex]: async (params) => {
            await ethGetUncleByBlockNumberAndIndex(thorClient, params);
        },

        [RPC_METHODS.eth_getUncleCountByBlockHash]: async (params) => {
            await ethGetUncleCountByBlockHash(thorClient, params);
        },

        [RPC_METHODS.eth_getUncleCountByBlockNumber]: async (params) => {
            await ethGetUncleCountByBlockNumber(thorClient, params);
        },

        [RPC_METHODS.eth_getWork]: async (params) => {
            await ethGetWork(thorClient, params);
        },

        [RPC_METHODS.eth_mining]: async (params) => {
            await ethMining(thorClient, params);
        },

        [RPC_METHODS.eth_hashrate]: async (params) => {
            await ethHashrate(thorClient, params);
        },

        [RPC_METHODS.eth_protocolVersion]: async (params) => {
            await ethProtocolVersion(thorClient, params);
        },

        [RPC_METHODS.eth_sign]: async (params) => {
            await ethSign(thorClient, params);
        },

        [RPC_METHODS.eth_submitWork]: async (params) => {
            await ethSubmitWork(thorClient, params);
        },

        [RPC_METHODS.net_listening]: async (params) => {
            await netListening(thorClient, params);
        },

        [RPC_METHODS.net_peerCount]: async (params) => {
            await netPeerCount(thorClient, params);
        },

        [RPC_METHODS.parity_nextNonce]: async (params) => {
            await parityNextNonce(thorClient, params);
        },

        [RPC_METHODS.eth_newFilter]: async (params) => {
            await ethNewFilter(thorClient, params);
        },

        [RPC_METHODS.eth_newBlockFilter]: async (params) => {
            await ethNewBlockFilter(thorClient, params);
        },

        [RPC_METHODS.eth_newPendingTransactionFilter]: async (params) => {
            await ethNewPendingTransactionFilter(thorClient, params);
        },

        [RPC_METHODS.eth_getFilterLogs]: async (params) => {
            await ethGetFilterLogs(thorClient, params);
        },

        [RPC_METHODS.eth_getFilterChanges]: async (params) => {
            await ethGetFilterChanges(thorClient, params);
        },

        [RPC_METHODS.eth_uninstallFilter]: async (params) => {
            await ethUninstallFilter(thorClient, params);
        },

        [RPC_METHODS.debug_getBadBlocks]: async (params) => {
            await debugGetBadBlocks(thorClient, params);
        },

        [RPC_METHODS.debug_getRawBlock]: async (params) => {
            await debugGetRawBlock(thorClient, params);
        },

        [RPC_METHODS.debug_getRawHeader]: async (params) => {
            await debugGetRawHeader(thorClient, params);
        },

        [RPC_METHODS.debug_getRawReceipts]: async (params) => {
            await debugGetRawReceipts(thorClient, params);
        },

        [RPC_METHODS.debug_getRawTransaction]: async (params) => {
            await debugGetRawTransaction(thorClient, params);
        },

        [RPC_METHODS.engine_exchangeCapabilities]: async (params) => {
            await engineExchangeCapabilities(thorClient, params);
        },

        [RPC_METHODS.engine_exchangeTransitionConfigurationV1]: async (
            params
        ) => {
            await engineExchangeTransitionConfigurationV1(thorClient, params);
        },

        [RPC_METHODS.engine_forkchoiceUpdatedV1]: async (params) => {
            await engineForkchoiceUpdatedV1(thorClient, params);
        },

        [RPC_METHODS.engine_forkchoiceUpdatedV2]: async (params) => {
            await engineForkchoiceUpdatedV2(thorClient, params);
        },

        [RPC_METHODS.engine_forkchoiceUpdatedV3]: async (params) => {
            await engineForkchoiceUpdatedV3(thorClient, params);
        },

        [RPC_METHODS.engine_getPayloadBodiesByHashV1]: async (params) => {
            await engineGetPayloadBodiesByHashV1(thorClient, params);
        },

        [RPC_METHODS.engine_getPayloadBodiesByRangeV1]: async (params) => {
            await engineGetPayloadBodiesByRangeV1(thorClient, params);
        },

        [RPC_METHODS.engine_getPayloadV1]: async (params) => {
            await engineGetPayloadV1(thorClient, params);
        },

        [RPC_METHODS.engine_getPayloadV2]: async (params) => {
            await engineGetPayloadV2(thorClient, params);
        },

        [RPC_METHODS.engine_getPayloadV3]: async (params) => {
            await engineGetPayloadV3(thorClient, params);
        },

        [RPC_METHODS.engine_newPayloadV1]: async (params) => {
            await engineNewPayloadV1(thorClient, params);
        },

        [RPC_METHODS.engine_newPayloadV2]: async (params) => {
            await engineNewPayloadV2(thorClient, params);
        },

        [RPC_METHODS.engine_newPayloadV3]: async (params) => {
            await engineNewPayloadV3(thorClient, params);
        },

        [RPC_METHODS.eth_createAccessList]: async (params) => {
            await ethCreateAccessList(thorClient, params);
        },

        [RPC_METHODS.eth_getBlockReceipts]: async (params) => {
            await ethGetBlockReceipts(thorClient, params);
        },

        [RPC_METHODS.eth_getProof]: async (params) => {
            await ethGetProof(thorClient, params);
        },

        [RPC_METHODS.eth_maxPriorityFeePerGas]: async (params) => {
            await ethMaxPriorityFeePerGas(thorClient, params);
        },

        [RPC_METHODS.eth_signTransaction]: async (params) => {
            await ethSignTransaction(thorClient, params);
        }
    };
};

export { RPCMethodsMap };
