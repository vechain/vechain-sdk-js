import {
    type SimulateTransactionClause,
    type ThorClient
} from '@vechain/vechain-sdk-network';
import { TransactionUtils } from '@vechain/vechain-sdk-core';
import { assert, DATA } from '@vechain/vechain-sdk-errors';

/**
 * RPC Method eth_estimateGas implementation
 *
 * @link [eth_estimateGas](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_estimategas)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The transaction call object
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

    // The intrinsic gas of the transaction
    const intrinsicGas = TransactionUtils.intrinsicGas([
        params as unknown as SimulateTransactionClause
    ]).toString(16);

    return await Promise.resolve(intrinsicGas);
};

export { ethEstimateGas };
