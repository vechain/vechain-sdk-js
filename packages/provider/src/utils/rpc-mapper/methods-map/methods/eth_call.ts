import { type TransactionClause } from '@vechain/vechain-sdk-core';
import { type ThorClient } from '@vechain/vechain-sdk-network';

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
    // assert missing
    const txObject = params[0] as TransactionClause[];

    const simulatedTx = await thorClient.transactions.simulateTransaction(
        txObject,
        {
            revision: params[1] as string
        }
    );

    return simulatedTx[0].data;
};

export { ethCall };
