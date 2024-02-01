import { assert, DATA } from '@vechain/vechain-sdk-errors';
import { JSONRPC, buildProviderError } from '../../../../../../errors/dist';
import {
    type SimulateTransactionClause,
    type SimulateTransactionOptions,
    type ThorClient
} from '@vechain/vechain-sdk-network';
import { type TransactionObj } from '../../types';

/**
 * RPC Method eth_estimateGas implementation
 *
 * @link [eth_estimateGas](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_estimategas)
 *
 * @param params - The transaction call object.
 *
 * @note At the moment only the `to`, `value` and `data` fields are supported.
 *
 * @returns A hexadecimal of the estimate of the gas for the given transaction.
 */
const ethEstimateGas = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<string> => {
    // Input validation - Invalid params
    assert(
        params.length === 1,
        DATA.INVALID_DATA_TYPE,
        'Invalid params length, expected 1.'
    );

    try {
        const { to, value, data, ...rest } = params[0] as TransactionObj;

        // Prepare transaction clauses for the estimateGas method
        const clauses: SimulateTransactionClause = {
            to,
            value,
            data
        };
        const options: SimulateTransactionOptions = {
            ...rest
        };

        const estimatedGas = await thorClient.gas.estimateGas(
            [clauses],
            options.caller
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
