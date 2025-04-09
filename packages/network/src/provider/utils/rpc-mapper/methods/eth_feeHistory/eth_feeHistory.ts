import { type ThorClient } from '../../../../../thor-client';
import { type VeChainProvider } from '../../../../providers/vechain-provider';
import {
    JSONRPCInvalidParams,
    JSONRPCInternalError,
    stringifyData
} from '@vechain/sdk-errors';
import { type FeeHistoryResponse } from '../../../../../thor-client/gas/types';
import { type DefaultBlock, DefaultBlockToRevision } from '../../../const';

/**
 * RPC Method eth_feeHistory implementation for Galactica hardfork
 *
 * @link [eth_feeHistory](https://ethereum.github.io/execution-apis/api-documentation/)
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: blockCount - number of blocks in the requested range
 *                 * params[1]: newestBlock - highest block of the requested range
 *                 * params[2]: rewardPercentiles - optional array of percentiles to compute
 * @param provider - The provider instance to use.
 * @returns Fee history for the returned block range
 * @throws {JSONRPCInvalidParams} | {JSONRPCInternalError}
 */
const ethFeeHistory = async (
    thorClient: ThorClient,
    params: unknown[],
    _provider?: VeChainProvider
): Promise<FeeHistoryResponse> => {
    if (!Array.isArray(params) || params.length < 2) {
        throw new JSONRPCInvalidParams(
            'eth_feeHistory',
            'Invalid input params for "eth_feeHistory" method.',
            { params }
        );
    }

    const blockCount = params[0];
    const newestBlock = params[1];
    const rewardPercentiles = params[2] as number[] | undefined;

    // Validate newestBlock is a string or number
    if (typeof newestBlock !== 'string' && typeof newestBlock !== 'number') {
        throw new JSONRPCInvalidParams(
            'eth_feeHistory',
            'Invalid newestBlock parameter. Must be a string or number.',
            { newestBlock }
        );
    }

    // Validate blockCount is a valid number
    const blockCountNum = Number(blockCount);
    if (!Number.isFinite(blockCountNum) || blockCountNum <= 0) {
        throw new JSONRPCInvalidParams(
            'eth_feeHistory',
            'blockCount must be a positive finite number.',
            { blockCount, blockCountNum }
        );
    }

    // convert default block to revision
    const revision = DefaultBlockToRevision(newestBlock as DefaultBlock);

    try {
        return await thorClient.gas.getFeeHistory({
            blockCount: blockCountNum,
            newestBlock: revision.toString(),
            rewardPercentiles
        });
    } catch (e) {
        if (e instanceof JSONRPCInvalidParams) {
            throw e;
        }
        throw new JSONRPCInternalError(
            'eth_feeHistory()',
            'Method "eth_feeHistory" failed.',
            {
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { ethFeeHistory };
