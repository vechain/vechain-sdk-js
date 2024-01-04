import {
    type ThorClient,
    type TransactionDetail
} from '@vechainfoundation/vechain-sdk-network';
import { type MethodHandlerType } from '../types';
import { RPC_METHODS } from '../../const/rpc-mapper';

/**
 * All RPC methods related to blocks
 *
 * @param thorClient - The
 */
const TransactionsMap = (
    thorClient: ThorClient
): Record<string, MethodHandlerType<unknown, unknown>> => {
    return {
        /**
         * Returns the block with the given block number.
         *
         * @NOTE IT IS A SIMPLE IMPLEMENTATION TO SET SKELETON! Checks must be done!
         *
         *
         * @param blockNumber - The block number.
         */
        [RPC_METHODS.eth_getTransactionByHash]: async (
            transactionHash
        ): Promise<TransactionDetail | null> => {
            return await thorClient.transactions.getTransaction(
                transactionHash[0] as string
            );
        }

        /**
         * ... Other RPC methods related to blocks ...
         */
        // ...
    };
};

export { TransactionsMap };
