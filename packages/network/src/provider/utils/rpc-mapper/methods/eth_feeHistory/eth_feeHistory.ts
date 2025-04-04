import { type ThorClient } from '../../../../../thor-client';
import { type VeChainProvider } from '../../../../providers/vechain-provider';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
import { type FeeHistoryResponse } from '../../../../../thor-client/gas/types';

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
 * @throws {JSONRPCInvalidParams}
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

    return await thorClient.gas.getFeeHistory({
        blockCount: Number(blockCount),
        newestBlock,
        rewardPercentiles
    });
};

export { ethFeeHistory };
