import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
import { Address, Hex, Secp256k1 } from '@vechain/sdk-core';
import { RPC_DOCUMENTATION_URL } from '../../../../../utils';

/**
 * RPC Method eth_getTransactionCount implementation
 *
 * @link [eth_getTransactionCount](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @note: To respect differences between VeChain and Ethereum, in this function we will give a random number as output.
 * Basically Ethereum to get nonce to use the number of transactions sent from an address,
 * while VeChain uses a random number.
 *
 * @param params - The standard array of rpc call parameters.
 *                * params[0]: address: string, is the address to get the number of transactions from.
 *                * params[1]: A string representing a block number, or one of the string tags latest, earliest, or pending.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethGetTransactionCount = async (params: unknown[]): Promise<string> => {
    // Input validation
    if (
        typeof params[0] !== 'string' ||
        (typeof params[1] !== 'object' && typeof params[1] !== 'string')
    )
        throw new JSONRPCInvalidParams(
            'eth_getTransactionCount',
            `Invalid input params for "eth_getTransactionCount" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    // Invalid address
    if (!Address.isValid(params[0])) {
        throw new JSONRPCInvalidParams(
            'eth_getTransactionCount',
            'Invalid address, expected a 20 bytes address string.',
            { params }
        );
    }

    // Return a random number
    return await Promise.resolve(Hex.of(Secp256k1.randomBytes(6)).toString());
};

export { ethGetTransactionCount };
