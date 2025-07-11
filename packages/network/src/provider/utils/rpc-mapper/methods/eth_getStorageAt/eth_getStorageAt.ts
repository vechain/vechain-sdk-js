import { Address, ThorId } from '@vechain/sdk-core';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import { type ThorClient } from '../../../../../thor-client';
import { RPC_DOCUMENTATION_URL } from '../../../../../utils';
import { type DefaultBlock, DefaultBlockToRevision } from '../../../const';

/**
 * RPC Method eth_getStorageAt implementation
 *
 * @link [eth_getStorageAt](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @note Only 'latest' and 'finalized' block numbers are supported.
 *
 * @param thorClient - ThorClient instance.
 * @param params - The standard array of rpc call parameters.
 *               * params[0]: The address to get the storage slot for as a hex string.
 *               * params[1]: The storage position to get as a hex string.
 *               * params[2]: The block number to get the storage slot at as a hex string or "latest".
 * @returns The storage slot of the account at the given address formatted to the RPC standard.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethGetStorageAt = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<string> => {
    // Input validation
    if (
        params.length !== 3 ||
        typeof params[0] !== 'string' ||
        (typeof params[1] !== 'string' && typeof params[1] !== 'bigint') ||
        (params[2] != null &&
            typeof params[2] !== 'object' &&
            typeof params[2] !== 'string')
    ) {
        throw new JSONRPCInvalidParams(
            'eth_getStorageAt',
            `Invalid input params for "eth_getStorageAt" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );
    }

    try {
        params[2] ??= 'latest';
        const [address, storagePosition, block] = params as [
            string,
            string,
            DefaultBlock
        ];

        // Get the account details
        const storage = await thorClient.accounts.getStorageAt(
            Address.of(address),
            ThorId.of(storagePosition),
            {
                revision: DefaultBlockToRevision(block)
            }
        );
        return storage.toString();
    } catch (e) {
        throw new JSONRPCInternalError(
            'eth_getStorageAt()',
            'Method "eth_getStorageAt" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { ethGetStorageAt };
