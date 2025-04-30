import { type ThorClient } from '../../../../../thor-client';
import { type VeChainProvider } from '../../../../providers/vechain-provider';
import {
    JSONRPCInternalError,
    JSONRPCMethodNotImplemented,
    stringifyData
} from '@vechain/sdk-errors';

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
const ethMaxPriorityFeePerGas = async (
    thorClient: ThorClient,
    _params: unknown[],
    _provider?: VeChainProvider
): Promise<string> => {
    try {
        // Check if Galactica hardfork has happened
        const galacticaForked = await thorClient.forkDetector.detectGalactica();
        if (!galacticaForked) {
            throw new JSONRPCMethodNotImplemented(
                'eth_maxPriorityFeePerGas',
                'Method "eth_maxPriorityFeePerGas" is not available before Galactica hardfork.',
                { url: thorClient.httpClient.baseURL }
            );
        }

        return await thorClient.gas.getMaxPriorityFeePerGas();
    } catch (e) {
        if (
            e instanceof JSONRPCInternalError ||
            e instanceof JSONRPCMethodNotImplemented
        ) {
            throw e;
        }
        throw new JSONRPCInternalError(
            'eth_maxPriorityFeePerGas()',
            'Method "eth_maxPriorityFeePerGas" failed.',
            {
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { ethMaxPriorityFeePerGas };
