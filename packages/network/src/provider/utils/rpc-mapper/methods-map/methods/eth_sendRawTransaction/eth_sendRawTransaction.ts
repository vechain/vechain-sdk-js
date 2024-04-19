import { type ThorClient } from '../../../../../../thor-client';
import { assert, buildProviderError, DATA, JSONRPC } from '@vechain/sdk-errors';
import { Hex0x } from '@vechain/sdk-core';
import { transactionsFormatter } from '../../../../formatter';

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
    assert(
        'eth_sendRawTransaction',
        params.length === 1 &&
            typeof params[0] === 'string' &&
            Hex0x.isValid(params[0]),
        DATA.INVALID_DATA_TYPE,
        'Invalid params, expected 1.\nThe param should be [signedTransactionData: string (hex string)]'
    );

    try {
        const [signedTransactionData] = params as [string];

        const sentTransaction =
            await thorClient.transactions.sendRawTransaction(
                signedTransactionData
            );

        return transactionsFormatter.formatSendRawTransactionToRPCStandard(
            sentTransaction
        );
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'eth_sendRawTransaction' failed: Error while sending the transaction ${
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

export { ethSendRawTransaction };
