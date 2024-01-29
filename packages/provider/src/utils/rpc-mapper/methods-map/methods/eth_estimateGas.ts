import {
    type SimulateTransactionClause,
    type ThorClient
} from '@vechain/vechain-sdk-network';
import { TransactionUtils } from '@vechain/vechain-sdk-core';

/**
 * RPC Method eth_estimateGas implementation
 *
 * @link [eth_estimateGas](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_estimategas)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const ethEstimateGas = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<string> => {
    // The intrinsic gas of the transaction
    const intrinsicGas = TransactionUtils.intrinsicGas(
        params as unknown as SimulateTransactionClause
    ).toString(16);

    return await Promise.resolve(intrinsicGas);
};

export { ethEstimateGas };
