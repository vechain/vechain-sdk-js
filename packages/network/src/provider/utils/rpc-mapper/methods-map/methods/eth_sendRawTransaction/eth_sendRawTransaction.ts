import { type ThorClient } from '../../../../../../thor-client';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import { RPC_DOCUMENTATION_URL } from '../../../../../../utils';
import { Hex } from '@vechain/sdk-core';

/**
 * RPC Method eth_sendRawTransaction implementation
 *
 * @link [eth_sendrawtransaction](https://docs.infura.io/api/networks/ethereum/json-rpc-methods/eth_sendrawtransaction)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The signed transaction data as a hex string.
 *
 * @returns void
 *
 * @throws {ProviderRpcError} - Will throw an error if the transaction fails.
 * @throws {InvalidDataTypeError} - Will throw an error if the params are invalid.
 */
const ethSendRawTransaction = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<string> => {
    // Input validation
    if (
        !(
            params.length !== 1 ||
            (typeof params[0] !== 'string' &&
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                !Hex.isValid0x(params[0] as string))
        )
    ) {
        try {
            const [signedTransactionData] = params as [string];

            const sentTransaction =
                await thorClient.transactions.sendRawTransaction(
                    signedTransactionData
                );

            return sentTransaction.id;
        } catch (e) {
            throw new JSONRPCInternalError(
                'eth_sendRawTransaction()',
                -32603,
                'Method "eth_sendRawTransaction" failed.',
                {
                    params: stringifyData(params),
                    url: thorClient.httpClient.baseURL,
                    innerError: stringifyData(e)
                }
            );
        }
    } else {
        throw new JSONRPCInvalidParams(
            'eth_sendRawTransaction',
            -32602,
            `Invalid input params for "eth_sendRawTransaction" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );
    }
};

export { ethSendRawTransaction };
