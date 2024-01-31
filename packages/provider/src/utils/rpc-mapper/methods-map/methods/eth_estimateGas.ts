import {
    type TransactionClause,
    TransactionUtils
} from '@vechain/vechain-sdk-core';
import { assert, DATA } from '@vechain/vechain-sdk-errors';
import { JSONRPC, buildProviderError } from '../../../../../../errors/dist';

/**
 * RPC Method eth_estimateGas implementation
 *
 * @link [eth_estimateGas](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_estimategas)
 *
 * @param params - The transaction call object
 *
 * @returns A hexadecimal of the estimate of the gas for the given transaction.
 */
const ethEstimateGas = async (params: unknown[]): Promise<string> => {
    // Input validation - Invalid params
    assert(
        params.length === 1,
        DATA.INVALID_DATA_TYPE,
        'Invalid params length, expected 1.'
    );

    try {
        // The intrinsic gas of the transaction
        const intrinsicGas = TransactionUtils.intrinsicGas(
            params as TransactionClause[]
        );

        // Convert intrinsic gas to hex string and return
        return await Promise.resolve('0x' + intrinsicGas.toString(16));
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
