import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import {
    type SimulateTransactionClause,
    type SimulateTransactionOptions,
    type ThorClient
} from '../../../../../thor-client';
import { RPC_DOCUMENTATION_URL } from '../../../../../utils';
import { type DefaultBlock, DefaultBlockToRevision } from '../../../const';
import { type TransactionObjectInput } from './types';

/**
 * RPC Method eth_call implementation
 *
 * @link [eth_call](https://ethereum.github.io/execution-apis/api-documentation/)
 * @param thorClient - The thor client instance to use.
 * @param params - The transaction call object
 * @returns The return value of executed contract.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethCall = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<string> => {
    // Input validation
    if (
        params.length !== 2 ||
        typeof params[0] !== 'object' ||
        (typeof params[1] !== 'object' && typeof params[1] !== 'string')
    ) {
        throw new JSONRPCInvalidParams(
            'eth_call',
            `Invalid input params for "eth_call" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );
    }

    try {
        const [inputOptions, block] = params as [
            TransactionObjectInput,
            DefaultBlock
        ];

        // Simulate transaction
        const simulatedTx = await thorClient.transactions.simulateTransaction(
            [
                {
                    to: inputOptions.to ?? null,
                    value: inputOptions.value ?? '0x0',
                    data: inputOptions.data ?? '0x0'
                } satisfies SimulateTransactionClause
            ],
            {
                revision: DefaultBlockToRevision(block).toString(),
                gas:
                    inputOptions.gas !== undefined
                        ? parseInt(inputOptions.gas, 16)
                        : undefined,
                gasPrice: inputOptions.gasPrice ?? inputOptions.gasPrice,
                caller: inputOptions.from
            } satisfies SimulateTransactionOptions
        );

        if (simulatedTx[0].reverted) {
            throw new JSONRPCInternalError(
                'eth_call()',
                'Method "eth_call" failed when simulating the transaction.',
                {
                    params: stringifyData(params),
                    innerError: simulatedTx[0].vmError
                }
            );
        }

        // Return simulated transaction data
        return simulatedTx[0].data;
    } catch (e) {
        if (e instanceof JSONRPCInternalError) {
            throw e;
        }
        throw new JSONRPCInternalError(
            'eth_call()',
            'Method "eth_call" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { ethCall };
