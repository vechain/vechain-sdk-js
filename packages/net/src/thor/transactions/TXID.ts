import { ThorId } from '@vechain/sdk-core';

class TXID {
    readonly id: ThorId;

    constructor(json: TXIDJSON) {
        this.id = ThorId.of(json.id);
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
