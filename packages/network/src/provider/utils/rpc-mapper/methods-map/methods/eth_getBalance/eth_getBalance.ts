import { type ThorClient } from '../../../../../../thor-client';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import type { BlockQuantityInputRPC } from '../../../types';
import { getCorrectBlockNumberRPCToVeChain } from '../../../../const';
import { RPC_DOCUMENTATION_URL } from '../../../../../../utils';

/**
 * RPC Method eth_getBalance implementation
 *
 * @link [eth_getBalance](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_getbalance)
 *
 * @note Only 'latest' and 'finalized' block numbers are supported.
 *
 * @param thorClient - ThorClient instance.
 * @param params - The standard array of rpc call parameters.
 *                * params[0]: The address to get the balance for as a hex string.
 *                * params[1]: The block number to get the balance at as a hex string or "latest".
 * @returns the balance of the account at the given address formatted to the RPC standard.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethGetBalance = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<string> => {
    // Input validation
    if (
        params.length !== 2 ||
        typeof params[0] !== 'string' ||
        (typeof params[1] !== 'object' && typeof params[1] !== 'string')
    )
        throw new JSONRPCInvalidParams(
            'eth_getBalance',
            -32602,
            `Invalid input params for "eth_getBalance" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    try {
        const [address, block] = params as [string, BlockQuantityInputRPC];

        // Get the account details
        const accountDetails = await thorClient.accounts.getAccount(address, {
            revision: getCorrectBlockNumberRPCToVeChain(block)
        });

        return accountDetails.balance;
    } catch (e) {
        throw new JSONRPCInternalError(
            'eth_getBalance()',
            -32603,
            'Method "eth_getBalance" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { ethGetBalance };
