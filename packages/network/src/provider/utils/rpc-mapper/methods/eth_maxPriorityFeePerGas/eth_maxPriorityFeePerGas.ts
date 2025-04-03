import { type ThorClient } from '../../../../../thor-client';
import { type VeChainProvider } from '../../../../providers/vechain-provider';
import { JSONRPCInternalError, stringifyData } from '@vechain/sdk-errors';

interface FeesPriorityResponse {
    maxPriorityFeePerGas: string;
}

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
 * @throws {JSONRPCInternalError}
 */
const ethMaxPriorityFeePerGas = async (
    thorClient: ThorClient,
    _params: unknown[],
    _provider?: VeChainProvider
): Promise<string> => {
    try {
        const response = (await thorClient.httpClient.get(
            '/fees/priority'
        )) as FeesPriorityResponse;

        // Validate response
        if (
            response === null ||
            response === undefined ||
            typeof response !== 'object'
        ) {
            throw new JSONRPCInternalError(
                'eth_maxPriorityFeePerGas()',
                'Invalid response format from /fees/priority endpoint',
                { response }
            );
        }

        if (
            response.maxPriorityFeePerGas === undefined ||
            response.maxPriorityFeePerGas === null ||
            response.maxPriorityFeePerGas === '' ||
            typeof response.maxPriorityFeePerGas !== 'string'
        ) {
            throw new JSONRPCInternalError(
                'eth_maxPriorityFeePerGas()',
                'Missing or invalid maxPriorityFeePerGas in response',
                { response }
            );
        }

        return response.maxPriorityFeePerGas;
    } catch (e) {
        if (e instanceof JSONRPCInternalError) {
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
