import { type ThorClient } from '../../../../../thor-client';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import type { BlockQuantityInputRPC } from '../../types';
import { getCorrectBlockNumberRPCToVeChain } from '../../../const';
import { RPC_DOCUMENTATION_URL } from '../../../../../utils';
import { Address, Revision } from '@vechain/sdk-core';

/**
 * RPC Method eth_getCode implementation
 *
 * @link [eth_getCode](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @note Only 'latest' and 'finalized' block numbers are supported.
 *
 * @param thorClient - ThorClient instance.
 * @param params - The standard array of rpc call parameters.
 *               * params[0]: The address to get the code for as a hex string.
 *               * params[1]: The block number to get the code at as a hex string or "latest".
 * @returns The code of the account at the given address formatted to the RPC standard.
 * @throws {JSONRPCInternalError}
 */
const ethGetCode = async (
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
            'eth_getCode',
            `Invalid input params for "eth_getCode" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    try {
        const [address, block] = params as [string, BlockQuantityInputRPC];

        // Get the account bytecode
        const bytecode = await thorClient.accounts.getBytecode(
            Address.of(address),
            {
                revision: Revision.of(getCorrectBlockNumberRPCToVeChain(block))
            }
        );
        return bytecode.toString();
    } catch (e) {
        throw new JSONRPCInternalError(
            'eth_getCode()',
            'Method "eth_getCode" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { ethGetCode };
