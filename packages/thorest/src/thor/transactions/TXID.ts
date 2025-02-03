import { TxId } from '@vechain/sdk-core/src';

class TXID {
    readonly id: TxId;

    constructor(json: TXIDJSON) {
        this.id = TxId.of(json.id);
    }

    toJSON(): TXIDJSON {
        return {
            id: this.id.toString()
        } satisfies TXIDJSON;
    }
}

interface TXIDJSON {
    id: string;
}

export { TXID, type TXIDJSON };
