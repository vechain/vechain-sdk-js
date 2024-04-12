import { type ThorClient } from '../../../../../../thor-client';
import { assert, buildProviderError, DATA, JSONRPC } from '@vechain/sdk-errors';
import type { BlockQuantityInputRPC } from '../../../types';
import { getCorrectBlockNumberRPCToVechain } from '../../../../const';

/**
 * RPC Method eth_getBalance implementation
 *
 * @link [eth_getBalance](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_getbalance)
 *
 * @param thorClient - ThorClient instance.
 * @param params - The standard array of rpc call parameters.
 *                * params[0]: The address to get the balance for as a hex string.
 *                * params[1]: The block number to get the balance at as a hex string or "latest".
 *
 * @returns the balance of the account at the given address formatted to the RPC standard.
 *
 * @note Only 'latest' and 'finalized' block numbers are supported.
 *
 * @throws {ProviderRpcError} - Will throw an error if the retrieval of the balance fails.
 */
const ethGetBalance = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<string> => {
    assert(
        'eth_getBalance',
        params.length === 2 &&
            typeof params[0] === 'string' &&
            (typeof params[1] === 'object' || typeof params[1] === 'string'),
        DATA.INVALID_DATA_TYPE,
        `Invalid params length, expected 2.\nThe params should be address: string` +
            `and the block tag parameter. 'latest', 'earliest', 'pending', 'safe' or 'finalized' or an object: \n{.` +
            `\tblockNumber: The number of the block` +
            `\n}\n\nOR\n\n{` +
            `\tblockHash: The hash of block` +
            `\n}`
    );

    try {
        const [address, block] = params as [string, BlockQuantityInputRPC];

        // Get the account details
        const accountDetails = await thorClient.accounts.getAccount(address, {
            revision: getCorrectBlockNumberRPCToVechain(block)
        });

        return accountDetails.balance;
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'eth_getBalance' failed: Error while getting the account's balance for the following address: ${
                params[0] as string
            }\n
            Params: ${JSON.stringify(params)}\n
            URL: ${thorClient.httpClient.baseURL}`,
            {
                params,
                innerError: JSON.stringify(e)
            }
        );
    }
};

export { ethGetBalance };
