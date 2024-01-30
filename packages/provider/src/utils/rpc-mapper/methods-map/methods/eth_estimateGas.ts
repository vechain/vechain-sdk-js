import {
    type TransactionClause,
    TransactionUtils
} from '@vechain/vechain-sdk-core';
import { assert, DATA } from '@vechain/vechain-sdk-errors';

/**
 * RPC Method eth_estimateGas implementation
 *
 * @link [eth_estimateGas](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_estimategas)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The transaction call object
 */
const ethEstimateGas = async (params: unknown[]): Promise<string> => {
    // Input validation - Invalid params
    assert(
        params.length === 1,
        DATA.INVALID_DATA_TYPE,
        'Invalid params length, expected 1.'
    );

    // The intrinsic gas of the transaction
    const intrinsicGas = TransactionUtils.intrinsicGas(
        params as TransactionClause[]
    );

    // Convert intrinsic gas to hex string and return
    return await Promise.resolve('0x' + intrinsicGas.toString(16));
};

export { ethEstimateGas };
