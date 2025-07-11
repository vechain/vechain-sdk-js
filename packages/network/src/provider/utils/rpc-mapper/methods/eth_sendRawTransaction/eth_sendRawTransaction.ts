import { Hex } from '@vechain/sdk-core';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import { type ThorClient } from '../../../../../thor-client';
import { RPC_DOCUMENTATION_URL } from '../../../../../utils';

/**
 * RPC Method eth_sendRawTransaction implementation
 *
 * @link [eth_sendrawtransaction](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The signed transaction data as a hex string.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethSendRawTransaction = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<string> => {
    // Input validation
    if (params.length !== 1 || typeof params[0] !== 'string')
        throw new JSONRPCInvalidParams(
            'eth_sendRawTransaction()',
            `Invalid input params for "eth_sendRawTransaction" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    // Invalid transaction encoded data
    if (!Hex.isValid0x(params[0])) {
        throw new JSONRPCInvalidParams(
            'eth_sendRawTransaction()',
            'Invalid transaction encoded data given as input. Input must be a hex string.',
            { params }
        );
    }

    try {
        const [signedTransactionData] = params as [string];

        const sentTransaction =
            await thorClient.transactions.sendRawTransaction(
                signedTransactionData
            );

        return sentTransaction.id;
    } catch (error) {
        throw new JSONRPCInternalError(
            'eth_sendRawTransaction()',
            'Method "eth_sendRawTransaction" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL
            },
            error
        );
    }
};

export { ethSendRawTransaction };
