import { assert, DATA } from '@vechain/vechain-sdk-errors';
import { randomBytes } from 'crypto';
import { addressUtils } from '@vechain/vechain-sdk-core';

/**
 * RPC Method eth_getTransactionCount implementation
 *
 * @link [eth_getTransactionCount](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_gettransactioncount)
 *
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: address: string, is the address to get the number of transactions from.
 *
 * @note: To respect differences between vechain and Ethereum, in this function we will give a random number as output.
 * Basically Ethereum to get nonce use the number of transactions sent from an address, while vechain use a random number.
 */
const ethGetTransactionCount = async (params: unknown[]): Promise<string> => {
    // Input validation - Invalid params
    assert(
        params.length === 1 && typeof params[0] === 'string',
        DATA.INVALID_DATA_TYPE,
        'Invalid params length, expected 1.\nThe params should be [address: string]'
    );

    // Input validation - Invalid address
    assert(
        addressUtils.isAddress(params[0] as string),
        DATA.INVALID_DATA_TYPE,
        'Invalid address, expected a 20 bytes address string.'
    );

    // Return a random number
    return await Promise.resolve(`0x${randomBytes(8).toString('hex')}`);
};

export { ethGetTransactionCount };
