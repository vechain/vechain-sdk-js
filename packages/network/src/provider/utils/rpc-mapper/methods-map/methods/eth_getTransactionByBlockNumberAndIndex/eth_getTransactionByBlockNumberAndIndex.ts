import { type ThorClient } from '../../../../../../thor-client';
import { type BlocksRPC, type TransactionRPC } from '../../../../formatter';
import { RPCMethodsMap } from '../../../rpc-mapper';
import { RPC_METHODS } from '../../../../const';

/**
 * RPC Method eth_getTransactionByBlockNumberAndIndex implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const ethGetTransactionByBlockNumberAndIndex = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<TransactionRPC | null> => {
    const [blockHash, index] = params as [string, string];

    // Get the block containing the transactions
    const block = (await RPCMethodsMap(thorClient)[
        RPC_METHODS.eth_getBlockByNumber
    ]([blockHash, false])) as BlocksRPC;

    for (let i = 0; i < block.transactions.length; i++) {
        const transaction = (await RPCMethodsMap(thorClient)[
            RPC_METHODS.eth_getTransactionByHash
        ]([block.transactions[i]])) as TransactionRPC;
        if (transaction.transactionIndex === index) {
            return transaction;
        }
    }

    return null;
};

export { ethGetTransactionByBlockNumberAndIndex };
