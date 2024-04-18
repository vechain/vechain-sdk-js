import { Hex0x } from '@vechain/sdk-core';
import { assert, buildProviderError, DATA, JSONRPC } from '@vechain/sdk-errors';
import { type ThorClient } from '../../../../../../thor-client';
import type { BlockQuantityInputRPC } from '../../../types';
import { getCorrectBlockNumberRPCToVechain } from '../../../../const';

/**
 * RPC Method eth_getStorageAt implementation
 *
 * @link [eth_getStorageAt](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_getstorageat)
 *
 * @param thorClient - ThorClient instance.
 * @param params - The standard array of rpc call parameters.
 *               * params[0]: The address to get the storage slot for as a hex string.
 *               * params[1]: The storage position to get as a hex string.
 *               * params[2]: The block number to get the storage slot at as a hex string or "latest".
 *
 * @returns The storage slot of the account at the given address formatted to the RPC standard.
 *
 * @note Only 'latest' and 'finalized' block numbers are supported.
 *
 * @throws {ProviderRpcError} - Will throw an error if the retrieval of the storage slot fails.
 */
const ethGetStorageAt = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<string> => {
    assert(
        'eth_getStorageAt',
        params.length === 3 &&
            typeof params[0] === 'string' &&
            typeof params[1] === 'string' &&
            (typeof params[2] === 'object' || typeof params[2] === 'string'),
        DATA.INVALID_DATA_TYPE,
        `Invalid params length, expected 3.` +
            `\nThe params should be:` +
            `\naddress: string, storagePosition: string` +
            `\nand the block tag parameter. 'latest', 'earliest', 'pending', 'safe' or 'finalized' or an object: \n{.` +
            `\tblockNumber: The number of the block` +
            `\n}\n\nOR\n\n{` +
            `\tblockHash: The hash of block` +
            `\n}`
    );

    try {
        const [address, storagePosition, block] = params as [
            string,
            string,
            BlockQuantityInputRPC
        ];

        // Get the account details
        return await thorClient.accounts.getStorageAt(
            address,
            Hex0x.canon(storagePosition, 32),
            {
                revision: getCorrectBlockNumberRPCToVechain(block)
            }
        );
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'eth_getStorageAt' failed: Error while getting the storage slot for the following address: ${
                params[0] as string
            }, and storage position: ${params[1] as string}\n
            Params: ${JSON.stringify(params)}\n
            URL: ${thorClient.httpClient.baseURL}`,
            {
                params,
                innerError: JSON.stringify(e)
            }
        );
    }
};

export { ethGetStorageAt };
