import { assert, DATA } from '@vechain/sdk-errors';
import { randomBytes } from 'crypto';
import { addressUtils, Hex } from '@vechain/sdk-core';

/**
 * RPC Method eth_getTransactionCount implementation
 *
 * @link [eth_getTransactionCount](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_gettransactioncount)
 *
 * @param params - The standard array of rpc call parameters.
 *                * params[0]: address: string, is the address to get the number of transactions from.
 *                * params[1]: A string representing a block number, or one of the string tags latest, earliest, or pending.
 *
 * @note: To respect differences between vechain and Ethereum, in this function we will give a random number as output.
 * Basically Ethereum to get nonce use the number of transactions sent from an address, while vechain use a random number.
 *
 * @throws {InvalidDataTypeError} - When address parameter is invalid.
 */
const ethGetTransactionCount = async (params: unknown[]): Promise<string> => {
    // Input validation - Invalid params
    assert(
        'eth_getTransactionCount',
        params.length === 2 &&
            typeof params[0] === 'string' &&
            typeof params[1] === 'string',
        DATA.INVALID_DATA_TYPE,
        'Invalid params length, expected 2.\nThe params should be [address: string, blockNumber: string]'
    );

    // Input validation - Invalid address
    assert(
        'eth_getTransactionCount',
        addressUtils.isAddress(params[0] as string),
        DATA.INVALID_DATA_TYPE,
        'Invalid address, expected a 20 bytes address string.'
    );

    // Return a random number
    return await Promise.resolve(Hex.of0x(randomBytes(6)));
};

export { ethGetTransactionCount };
