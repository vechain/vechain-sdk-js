import { type ThorClient } from '../../../../../thor-client';
import { type VeChainProvider } from '../../../../providers/vechain-provider';
/**
 * RPC Method eth_maxPriorityFeePerGas implementation for Galactica hardfork
 * Returns the suggested priority fee per gas in wei.
 * This is calculated based on the current base fee and network conditions.
 *
 * @link [eth_maxPriorityFeePerGas](https://ethereum.github.io/execution-apis/api-documentation/)
 * @param thorClient - The thor client instance to use.
 * @param _params - The standard array of rpc call parameters.
 * @param _provider - The provider instance to use.
 * @returns Suggested priority fee per gas in wei (hex string)
 * @throws {JSONRPCInternalError} | {JSONRPCMethodNotImplemented}
 */
declare const ethMaxPriorityFeePerGas: (thorClient: ThorClient, _params: unknown[], _provider?: VeChainProvider) => Promise<string>;
export { ethMaxPriorityFeePerGas };
//# sourceMappingURL=eth_maxPriorityFeePerGas.d.ts.map