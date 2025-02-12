import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import { type TransactionObjectInput } from './types';
import {
    type SimulateTransactionClause,
    type ThorClient
} from '../../../../../thor-client';
import { type DefaultBlock, DefaultBlockToRevision } from '../../../const';
import { RPC_DOCUMENTATION_URL } from '../../../../../utils';

/**
 * RPC Method eth_estimateGas implementation
 *
 * @link [eth_estimateGas](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @note At the moment only the `to`, `value` and `data` fields are supported.
 *
 * @param thorClient - ThorClient instance.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The transaction call object.
 *                 * params[1]: A string representing a block number, or one of the string tags latest, earliest, or pending.
 * @returns A hexadecimal number representing the estimation of the gas for a given transaction.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethEstimateGas = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<string> => {
    // Input validation
    if (params.length !== 2 || typeof params[0] !== 'object')
        throw new JSONRPCInvalidParams(
            'eth_estimateGas',
            `Invalid input params for "eth_estimateGas" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    try {
        // NOTE: The standard requires block parameter.
        // Here it is ignored and can be added in the future compatibility reasons.
        // (INPUT CHECK TAKE CARE OF THIS)
        const [inputOptions, defaultBlock] = params as [
            TransactionObjectInput,
            DefaultBlock
        ];
        const revision = DefaultBlockToRevision(defaultBlock);

        const estimatedGas = await thorClient.gas.estimateGas(
            [
                {
                    to: inputOptions.to ?? null,
                    value: inputOptions.value ?? '0x0',
                    data: inputOptions.data ?? '0x0'
                } satisfies SimulateTransactionClause
            ],
            inputOptions.from,
            {
                revision: revision.toString()
            }
        );

        // Convert intrinsic gas to hex string and return
        return await Promise.resolve('0x' + estimatedGas.totalGas.toString(16));
    } catch (e) {
        throw new JSONRPCInternalError(
            'eth_estimateGas()',
            'Method "eth_estimateGas" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { ethEstimateGas };
