import { type ThorClient } from '../../../../../thor-client';
import { RPC_DOCUMENTATION_URL } from '../../../../../utils';
import { type VeChainProvider } from '../../../../providers/vechain-provider';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';

export interface FeeHistoryResponse {
    oldestBlock: string;
    baseFeePerGas: string[];
    gasUsedRatio: string[];
    reward?: string[][];
}

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
            `Invalid input params for "eth_feeHistory" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );
    }

    return await Promise.resolve({
        oldestBlock: '0x0',
        baseFeePerGas: [],
        gasUsedRatio: [],
        reward: []
    });
};

export { ethFeeHistory };
