import { type MethodHandlerType } from './types';
import {
    debugGetBadBlocks,
    debugGetRawBlock,
    debugGetRawHeader,
    debugGetRawReceipts,
    debugGetRawTransaction,
    debugTraceCall,
    debugTraceTransaction,
    engineExchangeCapabilities,
    engineExchangeTransitionConfigurationV1,
    engineForkchoiceUpdatedV1,
    engineForkchoiceUpdatedV2,
    engineForkchoiceUpdatedV3,
    engineGetPayloadBodiesByHashV1,
    engineGetPayloadBodiesByRangeV1,
    engineGetPayloadV1,
    engineGetPayloadV2,
    engineGetPayloadV3,
    engineNewPayloadV1,
    engineNewPayloadV2,
    engineNewPayloadV3,
    ethAccounts,
    ethBlockNumber,
    ethCall,
    ethChainId,
    ethCoinbase,
    ethCreateAccessList,
    ethEstimateGas,
    ethFeeHistory,
    ethGasPrice,
    ethGetBalance,
    ethGetBlockByHash,
    ethGetBlockByNumber,
    ethGetBlockReceipts,
    ethGetBlockTransactionCountByHash,
    ethGetBlockTransactionCountByNumber,
    ethGetCode,
    ethGetFilterChanges,
    ethGetFilterLogs,
    ethGetLogs,
    ethGetProof,
    ethGetStorageAt,
    ethGetTransactionByBlockHashAndIndex,
    ethGetTransactionByBlockNumberAndIndex,
    ethGetTransactionByHash,
    ethGetTransactionCount,
    ethGetTransactionReceipt,
    ethGetUncleByBlockHashAndIndex,
    ethGetUncleByBlockNumberAndIndex,
    ethGetUncleCountByBlockHash,
    ethGetUncleCountByBlockNumber,
    ethGetWork,
    ethHashrate,
    ethMaxPriorityFeePerGas,
    ethMining,
    ethNewBlockFilter,
    ethNewFilter,
    ethNewPendingTransactionFilter,
    ethProtocolVersion,
    ethSendRawTransaction,
    ethSendTransaction,
    ethSign,
    ethSignTransaction,
    ethSubmitWork,
    ethSubscribe,
    ethSyncing,
    ethUninstallFilter,
    ethUnsubscribe,
    evmMine,
    netListening,
    netPeerCount,
    netVersion,
    parityNextNonce,
    web3ClientVersion,
    web3Sha3
} from './methods-map';
import { RPC_METHODS } from '../const';
import {
    type BlocksRPC,
    type LogsRPC,
    type SyncBlockRPC,
    type TracerReturnTypeRPC,
    type TransactionReceiptRPC,
    type TransactionRPC
} from '../formatter';
import { ethRequestAccounts } from './methods-map/methods/eth_requestAccounts';
import { type VeChainProvider } from '../../providers';
import { type ThorClient } from '../../../thor-client';

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
const RPCMethodsMap = (
    thorClient: ThorClient,
    provider?: VeChainProvider
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

        [RPC_METHODS.eth_estimateGas]: async (params): Promise<string> => {
            return await ethEstimateGas(thorClient, params);
        },

        [RPC_METHODS.eth_call]: async (params): Promise<string> => {
            return await ethCall(thorClient, params);
        },

        [RPC_METHODS.eth_sendRawTransaction]: async (
            params
        ): Promise<string> => {
            return await ethSendRawTransaction(thorClient, params);
        },

        [RPC_METHODS.eth_getLogs]: async (params): Promise<LogsRPC[]> => {
            return await ethGetLogs(thorClient, params);
        },

        [RPC_METHODS.eth_getBlockByHash]: async (
            params
        ): Promise<BlocksRPC | null> => {
            return await ethGetBlockByHash(thorClient, params);
        },

        [RPC_METHODS.eth_getBlockByNumber]: async (
            params
        ): Promise<BlocksRPC | null> => {
            return await ethGetBlockByNumber(thorClient, params);
        },

        [RPC_METHODS.eth_accounts]: async (): Promise<string[]> => {
            return await ethAccounts(provider);
        },

        [RPC_METHODS.eth_gasPrice]: async (): Promise<string> => {
            return await ethGasPrice(thorClient);
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

        [RPC_METHODS.eth_sendTransaction]: async (params): Promise<string> => {
            return await ethSendTransaction(thorClient, params, provider);
        },

        [RPC_METHODS.eth_syncing]: async (): Promise<
            boolean | SyncBlockRPC
        > => {
            return await ethSyncing(thorClient);
        },

        [RPC_METHODS.net_version]: async (): Promise<string> => {
            return await netVersion(thorClient);
        },

        [RPC_METHODS.web3_clientVersion]: async (): Promise<string> => {
            return await web3ClientVersion();
        },

        [RPC_METHODS.eth_subscribe]: async (params): Promise<string> => {
            return await ethSubscribe(thorClient, params, provider);
        },

        [RPC_METHODS.eth_unsubscribe]: async (params) => {
            return await ethUnsubscribe(params, provider);
        },

        [RPC_METHODS.debug_traceTransaction]: async (
            params
        ): Promise<
            TracerReturnTypeRPC<'call'> | TracerReturnTypeRPC<'prestate'>
        > => {
            return await debugTraceTransaction(thorClient, params);
        },

        [RPC_METHODS.debug_traceCall]: async (
            params
        ): Promise<
            TracerReturnTypeRPC<'call'> | TracerReturnTypeRPC<'prestate'>
        > => {
            return await debugTraceCall(thorClient, params);
        },

        [RPC_METHODS.evm_mine]: async (): Promise<BlocksRPC | null> => {
            return await evmMine(thorClient);
        },

        [RPC_METHODS.eth_coinbase]: async () => {
            await ethCoinbase();
        },

        [RPC_METHODS.eth_feeHistory]: async () => {
            await ethFeeHistory();
        },

        [RPC_METHODS.eth_getBlockTransactionCountByHash]: async () => {
            await ethGetBlockTransactionCountByHash();
        },

        [RPC_METHODS.eth_getBlockTransactionCountByNumber]: async () => {
            await ethGetBlockTransactionCountByNumber();
        },

        [RPC_METHODS.eth_getTransactionByBlockHashAndIndex]: async () => {
            await ethGetTransactionByBlockHashAndIndex();
        },

        [RPC_METHODS.eth_getTransactionByBlockNumberAndIndex]: async () => {
            await ethGetTransactionByBlockNumberAndIndex();
        },

        [RPC_METHODS.eth_getUncleByBlockHashAndIndex]: async () => {
            await ethGetUncleByBlockHashAndIndex();
        },

        [RPC_METHODS.eth_getUncleByBlockNumberAndIndex]: async () => {
            await ethGetUncleByBlockNumberAndIndex();
        },

        [RPC_METHODS.eth_getUncleCountByBlockHash]: async () => {
            await ethGetUncleCountByBlockHash();
        },

        [RPC_METHODS.eth_getUncleCountByBlockNumber]: async () => {
            await ethGetUncleCountByBlockNumber();
        },

        [RPC_METHODS.eth_getWork]: async () => {
            await ethGetWork();
        },

        [RPC_METHODS.eth_mining]: async () => {
            await ethMining();
        },

        [RPC_METHODS.eth_hashrate]: async () => {
            await ethHashrate();
        },

        [RPC_METHODS.eth_protocolVersion]: async () => {
            await ethProtocolVersion();
        },

        [RPC_METHODS.eth_requestAccounts]: async (): Promise<string[]> => {
            return await ethRequestAccounts(provider);
        },

        [RPC_METHODS.eth_sign]: async () => {
            await ethSign();
        },

        [RPC_METHODS.eth_submitWork]: async () => {
            await ethSubmitWork();
        },

        [RPC_METHODS.net_listening]: async () => {
            await netListening();
        },

        [RPC_METHODS.net_peerCount]: async () => {
            await netPeerCount();
        },

        [RPC_METHODS.parity_nextNonce]: async () => {
            await parityNextNonce();
        },

        [RPC_METHODS.eth_newFilter]: async () => {
            await ethNewFilter();
        },

        [RPC_METHODS.eth_newBlockFilter]: async () => {
            await ethNewBlockFilter();
        },

        [RPC_METHODS.eth_newPendingTransactionFilter]: async () => {
            await ethNewPendingTransactionFilter();
        },

        [RPC_METHODS.eth_getFilterLogs]: async () => {
            await ethGetFilterLogs();
        },

        [RPC_METHODS.eth_getFilterChanges]: async () => {
            await ethGetFilterChanges();
        },

        [RPC_METHODS.eth_uninstallFilter]: async () => {
            await ethUninstallFilter();
        },

        [RPC_METHODS.debug_getBadBlocks]: async () => {
            await debugGetBadBlocks();
        },

        [RPC_METHODS.debug_getRawBlock]: async () => {
            await debugGetRawBlock();
        },

        [RPC_METHODS.debug_getRawHeader]: async () => {
            await debugGetRawHeader();
        },

        [RPC_METHODS.debug_getRawReceipts]: async () => {
            await debugGetRawReceipts();
        },

        [RPC_METHODS.debug_getRawTransaction]: async () => {
            await debugGetRawTransaction();
        },

        [RPC_METHODS.engine_exchangeCapabilities]: async () => {
            await engineExchangeCapabilities();
        },

        [RPC_METHODS.engine_exchangeTransitionConfigurationV1]: async () => {
            await engineExchangeTransitionConfigurationV1();
        },

        [RPC_METHODS.engine_forkchoiceUpdatedV1]: async () => {
            await engineForkchoiceUpdatedV1();
        },

        [RPC_METHODS.engine_forkchoiceUpdatedV2]: async () => {
            await engineForkchoiceUpdatedV2();
        },

        [RPC_METHODS.engine_forkchoiceUpdatedV3]: async () => {
            await engineForkchoiceUpdatedV3();
        },

        [RPC_METHODS.engine_getPayloadBodiesByHashV1]: async () => {
            await engineGetPayloadBodiesByHashV1();
        },

        [RPC_METHODS.engine_getPayloadBodiesByRangeV1]: async () => {
            await engineGetPayloadBodiesByRangeV1();
        },

        [RPC_METHODS.engine_getPayloadV1]: async () => {
            await engineGetPayloadV1();
        },

        [RPC_METHODS.engine_getPayloadV2]: async () => {
            await engineGetPayloadV2();
        },

        [RPC_METHODS.engine_getPayloadV3]: async () => {
            await engineGetPayloadV3();
        },

        [RPC_METHODS.engine_newPayloadV1]: async () => {
            await engineNewPayloadV1();
        },

        [RPC_METHODS.engine_newPayloadV2]: async () => {
            await engineNewPayloadV2();
        },

        [RPC_METHODS.engine_newPayloadV3]: async () => {
            await engineNewPayloadV3();
        },

        [RPC_METHODS.eth_createAccessList]: async () => {
            await ethCreateAccessList();
        },

        [RPC_METHODS.eth_getBlockReceipts]: async (
            params
        ): Promise<TransactionReceiptRPC[] | null> => {
            return await ethGetBlockReceipts(thorClient, params);
        },

        [RPC_METHODS.eth_getProof]: async () => {
            await ethGetProof();
        },

        [RPC_METHODS.eth_maxPriorityFeePerGas]: async () => {
            await ethMaxPriorityFeePerGas();
        },

        [RPC_METHODS.eth_signTransaction]: async () => {
            await ethSignTransaction();
        },

        [RPC_METHODS.web3_sha3]: async (params): Promise<string> => {
            return await web3Sha3(params);
        }
    };
};

export { RPCMethodsMap };
