import {
    type GetTransactionOptions,
    Transaction
} from '@thor/thor-client/model/transactions';
import { AbstractThorModule } from '../AbstractThorModule';
import { type Hex } from '@common/vcdm';
import { RetrieveTransactionByID } from '@thor/thorest';

class TransactionsModule extends AbstractThorModule {
    /**
     * Retrieves a transaction by its ID.
     * @param id - The ID of the transaction to get.
     * @param pending - Whether to include pending transaction.
     * @param head - Define the ID of the head block. Best block is assumed if omitted..
     * @returns The transaction or null if it is not found.
     */
    public async getTransaction(
        id: Hex,
        options: GetTransactionOptions
    ): Promise<Transaction | null> {
        const request = RetrieveTransactionByID.of(id)
            .withPending(options.pending)
            .withHead(options.head);
        const thorResponse = await request.askTo(this.httpClient);
        return thorResponse.response !== null
            ? new Transaction(thorResponse.response)
            : null;
    }
}

export { TransactionsModule };
