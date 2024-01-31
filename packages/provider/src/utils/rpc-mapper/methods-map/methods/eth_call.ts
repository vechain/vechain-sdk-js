import {
    type SimulateTransactionClause,
    type ThorClient
} from '@vechain/vechain-sdk-network';
import { assert, DATA } from '@vechain/vechain-sdk-errors';
import { JSONRPC, buildProviderError } from '../../../../../../errors/dist';

/**
 * RPC Method eth_call implementation
 *
 * @link [eth_call](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_call)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The transaction call object
 *
 * @returns The return value of executed contract.
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

    try {
        // Simulate transaction
        const simulatedTx = await thorClient.transactions.simulateTransaction(
            params as SimulateTransactionClause[]
        );

        // Return simulated transaction data
        return simulatedTx[0].data;
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'eth_call' failed: Error while simulating transaction\n
            Params: ${JSON.stringify(params)}\n
            URL: ${thorClient.httpClient.baseURL}`,
            {
                params,
                innerError: JSON.stringify(e)
            }
        );
    }
};

export { ethCall };
