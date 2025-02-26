import { BlockId } from '@vechain/sdk-core';
import {
    GetTxResponse,
    type GetTxResponseJSON,
    Receipt,
    type ReceiptJSON
} from '../transactions';
import {
    CommmonBlockResponse,
    type CommmonBlockResponseJSON
} from './CommonBlockResponse';

class TransactionWithOutputs {
    readonly transaction: Omit<GetTxResponse, 'meta'>;
    readonly receipt: Receipt;

    constructor(json: TransactionWithOutputsJSON) {
        const transactionWithoutMeta = new GetTxResponse({
            ...json,
            meta: {
                blockID: BlockId.of(0).fit(64).toString(),
                blockNumber: 0,
                blockTimestamp: 0
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { meta, ...transactionWithoutMetaNoMeta } =
            transactionWithoutMeta;
        this.transaction = {
            ...transactionWithoutMetaNoMeta,
            toJSON: () => transactionWithoutMeta.toJSON()
        } satisfies Omit<GetTxResponse, 'meta'>;
        this.receipt = new Receipt(json);
    }

    toJSON(): TransactionWithOutputsJSON {
        return {
            ...this.transaction.toJSON(),
            ...this.receipt.toJSON()
        } satisfies TransactionWithOutputsJSON;
    }
}

type TransactionWithOutputsJSON = Omit<GetTxResponseJSON, 'meta'> & ReceiptJSON;

class ExpandedBlockResponse extends CommmonBlockResponse {
    readonly transactions: TransactionWithOutputs[];

    constructor(json: ExpandedBlockResponseJSON) {
        super(json);
        this.transactions = json.transactions.map(
            (txId: TransactionWithOutputsJSON): TransactionWithOutputs =>
                new TransactionWithOutputs(txId)
        );
    }

    toJSON(): ExpandedBlockResponseJSON {
        return {
            ...super.toJSON(),
            transactions: this.transactions.map((tx: TransactionWithOutputs) =>
                tx.toJSON()
            )
        };
    }
}

interface ExpandedBlockResponseJSON extends CommmonBlockResponseJSON {
    transactions: TransactionWithOutputsJSON[];
}

export { ExpandedBlockResponse, type ExpandedBlockResponseJSON };
