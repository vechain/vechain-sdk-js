import { type ThorClient } from '../../../thor-client';
import { type FeeHistoryResponse } from '../../../thor-client/gas/types';
import { type VeChainProvider } from '../../providers/vechain-provider';
import { RPC_METHODS } from '../const/rpc-mapper/rpc-methods';
import {
    type BlocksRPC,
    type LogsRPC,
    type SyncBlockRPC,
    type TracerReturnTypeRPC,
    type TransactionReceiptRPC,
    type TransactionRPC
} from '../formatter';
import {
    debugTraceBlockByHash,
    debugTraceBlockByNumber,
    debugTraceCall,
    debugTraceTransaction,
    ethAccounts,
    ethBlockNumber,
    ethCall,
    ethChainId,
    ethEstimateGas,
    ethGasPrice,
    ethGetBalance,
    ethGetBlockByHash,
    ethGetBlockByNumber,
    ethGetBlockReceipts,
    ethGetBlockTransactionCountByHash,
    ethGetBlockTransactionCountByNumber,
    ethGetCode,
    ethGetLogs,
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
    ethRequestAccounts,
    ethSendRawTransaction,
    ethSendTransaction,
    ethSignTransaction,
    ethSignTypedDataV4,
    ethSubscribe,
    ethSyncing,
    ethUnsubscribe,
    evmMine,
    netListening,
    netPeerCount,
    netVersion,
    txPoolContent,
    txPoolContentFrom,
    txPoolInspect,
    txPoolStatus,
    web3ClientVersion,
    web3Sha3
} from './methods';
import { ethFeeHistory } from './methods/eth_feeHistory/eth_feeHistory';
import { ethMaxPriorityFeePerGas } from './methods/eth_maxPriorityFeePerGas/eth_maxPriorityFeePerGas';

type MethodHandlerType<TParams, TReturnType> = (
    params: TParams[]
) => Promise<TReturnType>;

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

        [RPC_METHODS.evm_increaseTime]: async (): Promise<null> => {
            // @see https://docs.vechain.org/core-concepts/evm-compatibility/test-coverage/hardhat-specific/evm_increasetime
            // VeChain does not support evm_increaseTime, so we use evm_mine instead
            // This is a workaround to be able to use hardhat's evm_increaseTime
            return await evmMine(thorClient);
        },

        [RPC_METHODS.evm_mine]: async (): Promise<null> => {
            return await evmMine(thorClient);
        },

        [RPC_METHODS.eth_getBlockTransactionCountByHash]: async (
            params
        ): Promise<number> => {
            return await ethGetBlockTransactionCountByHash(thorClient, params);
        },

        [RPC_METHODS.eth_getBlockTransactionCountByNumber]: async (
            params
        ): Promise<number> => {
            return await ethGetBlockTransactionCountByNumber(
                thorClient,
                params
            );
        },

        [RPC_METHODS.eth_getTransactionByBlockHashAndIndex]: async (
            params
        ): Promise<TransactionRPC | null> => {
            return await ethGetTransactionByBlockHashAndIndex(
                thorClient,
                params
            );
        },

        [RPC_METHODS.eth_getTransactionByBlockNumberAndIndex]: async (
            params
        ): Promise<TransactionRPC | null> => {
            return await ethGetTransactionByBlockNumberAndIndex(
                thorClient,
                params
            );
        },

        [RPC_METHODS.eth_getUncleByBlockHashAndIndex]: async (
            params
        ): Promise<object | null> => {
            return await ethGetUncleByBlockHashAndIndex(params);
        },

        [RPC_METHODS.eth_getUncleByBlockNumberAndIndex]: async (
            params
        ): Promise<object | null> => {
            return await ethGetUncleByBlockNumberAndIndex(params);
        },

        [RPC_METHODS.eth_getUncleCountByBlockHash]: async (
            params
        ): Promise<number> => {
            return await ethGetUncleCountByBlockHash(params);
        },

        [RPC_METHODS.eth_getUncleCountByBlockNumber]: async (
            params
        ): Promise<number> => {
            return await ethGetUncleCountByBlockNumber(params);
        },

        [RPC_METHODS.eth_requestAccounts]: async (): Promise<string[]> => {
            return await ethRequestAccounts(provider);
        },

        [RPC_METHODS.net_listening]: async (): Promise<boolean> => {
            return await netListening(thorClient);
        },

        [RPC_METHODS.net_peerCount]: async (): Promise<number> => {
            return await netPeerCount(thorClient);
        },

        [RPC_METHODS.eth_getBlockReceipts]: async (
            params
        ): Promise<TransactionReceiptRPC[] | null> => {
            return await ethGetBlockReceipts(thorClient, params);
        },

        [RPC_METHODS.eth_signTransaction]: async (params): Promise<string> => {
            return await ethSignTransaction(thorClient, params, provider);
        },

        [RPC_METHODS.web3_sha3]: async (params): Promise<string> => {
            return await web3Sha3(params);
        },

        [RPC_METHODS.txpool_inspect]: async (): Promise<object> => {
            return await txPoolInspect();
        },

        [RPC_METHODS.txpool_content]: async (): Promise<object> => {
            return await txPoolContent();
        },

        [RPC_METHODS.txpool_contentFrom]: async (params): Promise<object> => {
            return await txPoolContentFrom(params);
        },

        [RPC_METHODS.txpool_status]: async (): Promise<object> => {
            return await txPoolStatus();
        },

        [RPC_METHODS.debug_traceBlockByHash]: async (
            params
        ): Promise<
            Array<{
                txHash: string;
                result:
                    | TracerReturnTypeRPC<'call'>
                    | TracerReturnTypeRPC<'prestate'>;
            }>
        > => {
            return await debugTraceBlockByHash(thorClient, params);
        },

        [RPC_METHODS.debug_traceBlockByNumber]: async (
            params
        ): Promise<
            Array<{
                txHash: string;
                result:
                    | TracerReturnTypeRPC<'call'>
                    | TracerReturnTypeRPC<'prestate'>;
            }>
        > => {
            return await debugTraceBlockByNumber(thorClient, params);
        },

        [RPC_METHODS.eth_signTypedData_v4]: async (params): Promise<string> => {
            return await ethSignTypedDataV4(thorClient, params, provider);
        },

        [RPC_METHODS.eth_maxPriorityFeePerGas]: async (
            params
        ): Promise<string> => {
            return await ethMaxPriorityFeePerGas(thorClient, params, provider);
        },

        [RPC_METHODS.eth_feeHistory]: async (
            params
        ): Promise<FeeHistoryResponse> => {
            return await ethFeeHistory(thorClient, params, provider);
        }
    };
};
export { RPCMethodsMap };
