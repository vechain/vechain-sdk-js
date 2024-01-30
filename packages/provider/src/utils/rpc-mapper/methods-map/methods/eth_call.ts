import {
    type SimulateTransactionClause,
    type ThorClient
} from '@vechain/vechain-sdk-network';
import { assert, DATA } from '@vechain/vechain-sdk-errors';

/**
 * RPC Method eth_call implementation
 *
 * @link [eth_call](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_call)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The transaction call object
 */
const ethCall = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<string> => {
    // Input validation - Invalid params
    assert(
        params.length >= 1,
        DATA.INVALID_DATA_TYPE,
        'Invalid params length, expected at least 1.'
    );

    const simulatedTx = await thorClient.transactions.simulateTransaction(
        params as SimulateTransactionClause[]
    );

    return simulatedTx[0].data;
};

export { ethCall };
