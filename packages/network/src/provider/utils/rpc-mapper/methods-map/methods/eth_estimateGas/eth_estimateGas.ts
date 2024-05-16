import { assert, buildProviderError, DATA, JSONRPC } from '@vechain/sdk-errors';
import { type TransactionObjectInput } from './types';
import {
    type SimulateTransactionClause,
    type ThorClient
} from '../../../../../../thor-client';
import { getCorrectBlockNumberRPCToVechain } from '../../../../const';
import { type BlockQuantityInputRPC } from '../../../types';

/**
 * RPC Method eth_estimateGas implementation
 *
 * @link [eth_estimateGas](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_estimategas)
 *
 * @param thorClient - ThorClient instance.
 * @param params - The standard array of rpc call parameters.
 *                * params[0]: The transaction call object.
 *                 * params[1]: A string representing a block number, or one of the string tags latest, earliest, or pending.
 *
 * @note At the moment only the `to`, `value` and `data` fields are supported.
 *
 * @returns A hexadecimal of the estimate of the gas for the given transaction.
 */
const ethEstimateGas = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<string> => {
    // Check input params
    assert(
        'eth_estimateGas',
        [1, 2].includes(params.length) && typeof params[0] === 'object',
        DATA.INVALID_DATA_TYPE,
        `Invalid params length, expected 1 object containing transaction info with following properties: \n {` +
            `\tfrom: 20 bytes Address the transaction is sent from.` +
            `\tto: [Required] 20 bytes - Address the transaction is directed to.` +
            `\tgas: Hexadecimal value of the gas provided for the transaction execution. eth_estimateGas consumes zero gas, but this parameter may be needed by some executions.` +
            `\tgasPrice:Hexadecimal value of the gas price used for each paid gas.` +
            `\tmaxPriorityFeePerGas: Maximum fee, in Wei, the sender is willing to pay per gas above the base fee` +
            `\tmaxFeePerGas: Maximum total fee (base fee + priority fee), in Wei, the sender is willing to pay per gas` +
            `\tvalue: Hexadecimal of the value sent with this transaction.` +
            `\tdata: Hash of the method signature and encoded parameters` +
            `}\n\n and, OPTIONALLY, the block number parameter. An hexadecimal number or (latest, earliest or pending).`
    );

    try {
        // NOTE: The standard requires block parameter.
        // Here it is ignored and can be added in the future compatibility reasons.
        // (INPUT CHECK TAKE CARE OF THIS)
        const [inputOptions, revision] = params as [
            TransactionObjectInput,
            BlockQuantityInputRPC?
        ];

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
                revision:
                    revision !== undefined
                        ? getCorrectBlockNumberRPCToVechain(revision)
                        : undefined
            }
        );

        // Convert intrinsic gas to hex string and return
        return await Promise.resolve('0x' + estimatedGas.totalGas.toString(16));
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'eth_estimateGas' failed: Error while calculating gas for ${
                params[0] as string
            } transaction\n
            Params: ${JSON.stringify(params)}\n`,
            {
                params,
                innerError: JSON.stringify(e)
            }
        );
    }
};

export { ethEstimateGas };
