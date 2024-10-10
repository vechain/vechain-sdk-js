import type { ThorClient } from '../../../../../thor-client';
import type { VeChainProvider } from '../../../../providers/vechain-provider';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import { RPC_DOCUMENTATION_URL } from '../../../../../utils';
import type { TransactionObjectInput } from '../eth_sendTransaction';
import type { VeChainSigner } from '../../../../../signer';

/**
 * RPC Method eth_signTransaction implementation
 *
 * @link [eth_signTransaction](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *               * params[0]: transaction - object - This describes the transaction info with following properties:
 *                   * to: 20 bytes - Address the transaction is directed to.
 *                   * from: 20 bytes [Required] - Address the transaction is sent from.
 *                   * gas: Hexadecimal value of the gas provided for the transaction execution as hex string.
 *                   * gasPrice: Hexadecimal value of the gasPrice used for each paid gas.
 *                   * value: Hexadecimal of the value sent with this transaction.
 *                   * data: Hash of the method signature and encoded parameters.
 *                   * nonce: The nonce of the transaction.
 * @param provider - The provider instance to use.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethSignTransaction = async (
    thorClient: ThorClient,
    params: unknown[],
    provider?: VeChainProvider
): Promise<string> => {
    // Input validation
    if (params.length !== 1 || typeof params[0] !== 'object')
        throw new JSONRPCInvalidParams(
            'eth_signTransaction',
            `Invalid input params for "eth_signTransaction" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    // Provider must be defined
    if (provider?.wallet === undefined) {
        throw new JSONRPCInvalidParams(
            'eth_signTransaction',
            'Provider must be defined with a wallet. Ensure that the provider is defined and connected to the network.',
            { provider }
        );
    }

    // From field is required
    if ((params[0] as TransactionObjectInput).from === undefined) {
        throw new JSONRPCInvalidParams(
            'eth_signTransaction',
            'From field is required in the transaction object.',
            { provider }
        );
    }

    // Input params
    const [transaction] = params as [TransactionObjectInput];

    try {
        // Get the signer of the provider
        const signer = (await provider.getSigner(
            transaction.from
        )) as VeChainSigner;

        // Return the result
        return await signer.signTransaction(transaction);
    } catch (error) {
        throw new JSONRPCInternalError(
            'eth_signTransaction()',
            'Method "eth_signTransaction" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL
            },
            error
        );
    }
};

export { ethSignTransaction };
