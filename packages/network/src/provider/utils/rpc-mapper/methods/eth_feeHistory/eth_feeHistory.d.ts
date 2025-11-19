import { type ThorClient } from '../../../../../thor-client';
import { type FeeHistoryResponse } from '../../../../../thor-client/gas/types';
import { type VeChainProvider } from '../../../../providers/vechain-provider';
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
 * @throws {JSONRPCInvalidParams} | {JSONRPCInternalError} | {JSONRPCMethodNotImplemented}
 */
declare const ethFeeHistory: (thorClient: ThorClient, params: unknown[], _provider?: VeChainProvider) => Promise<FeeHistoryResponse>;
export { ethFeeHistory };
//# sourceMappingURL=eth_feeHistory.d.ts.map