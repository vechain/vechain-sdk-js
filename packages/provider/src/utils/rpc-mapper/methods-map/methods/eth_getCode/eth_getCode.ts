import { type ThorClient } from '@vechain/vechain-sdk-network';
import {
    assert,
    buildProviderError,
    DATA,
    JSONRPC
} from '@vechain/vechain-sdk-errors';

/**
 * RPC Method eth_getCode implementation
 *
 * @link [eth_getCode](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_getcode)
 *
 * @param thorClient - ThorClient instance.
 * @param params - The standard array of rpc call parameters.
 *               * params[0]: The address to get the code for as a hex string.
 *               * params[1]: The block number to get the code at as a hex string or "latest".
 *
 * @returns The code of the account at the given address formatted to the RPC standard.
 *
 * @note Only 'latest' and 'finalized' block numbers are supported.
 *
 * @throws {ProviderRpcError} - Will throw an error if the retrieval of the code fails.
 */
const ethGetCode = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<string> => {
    assert(
        'eth_getCode',
        params.length === 2 &&
            typeof params[0] === 'string' &&
            typeof params[1] === 'string',
        DATA.INVALID_DATA_TYPE,
        'Invalid params length, expected 2.\nThe params should be [address: string, blockNumber: string | "latest"]'
    );

    try {
        let [address, blockNumber] = params as [string, string];

        if (blockNumber === 'latest') blockNumber = 'best';

        // Get the account details
        return await thorClient.accounts.getBytecode(address, {
            revision: blockNumber
        });
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'eth_getCode' failed: Error while getting the account's code for the following address: ${
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

export { ethGetCode };
