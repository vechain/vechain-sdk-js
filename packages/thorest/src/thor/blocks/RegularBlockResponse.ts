import { TxId } from '@vechain/sdk-core';
import {
    CommmonBlockResponse,
    type CommmonBlockResponseJSON
} from './CommonBlockResponse';

class RegularBlockResponse extends CommmonBlockResponse {
    readonly transactions: TxId[];

    constructor(json: RegularBlockResponseJSON) {
        super(json);
        this.transactions = json.transactions.map(
            (txId: string): TxId => TxId.of(txId)
        );
    }

    toJSON(): RegularBlockResponseJSON {
        return {
            ...super.toJSON(),
            transactions: this.transactions.map((txId) => txId.toString())
        };
    }
}

interface RegularBlockResponseJSON extends CommmonBlockResponseJSON {
    transactions: string[];
}

export { RegularBlockResponse, type RegularBlockResponseJSON };
