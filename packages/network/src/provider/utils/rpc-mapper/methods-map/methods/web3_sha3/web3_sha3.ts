import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
import { Hex, Keccak256 } from '@vechain/sdk-core';

/**
 * RPC Method web3_sha3 implementation
 *
 * @link [web3_sha3](https://docs.alchemy.com/reference/web3-sha3)
 * @param params - The standard array of rpc call parameters.
 *                * params[0]: The data to hash.
 * @returns A string representing the current client version.
 */
const web3Sha3 = async (params: unknown[]): Promise<string> => {
    // Input validation
    if (
        params.length !== 1 ||
        typeof params[0] !== 'string' ||
        !Hex.isValid(params[0])
    )
        throw new JSONRPCInvalidParams(
            'web3_sha3',
            -32602,
            `Invalid input params for "web3_sha3" method. See 'https://docs.alchemy.com/reference/web3-sha3' for details.`,
            { params }
        );

    return await Promise.resolve(Keccak256.of(params[0]).toString());
};

export { web3Sha3 };
