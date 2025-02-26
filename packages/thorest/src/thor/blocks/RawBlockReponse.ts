import { Hex } from '@vechain/sdk-core';

class RawBlockResponse {
    readonly raw: Hex;

    constructor(json: RawBlockResponseJSON) {
        this.raw = Hex.of(json.raw);
    }

    toJSON(): RawBlockResponseJSON {
        return {
            raw: this.raw.toString()
        } satisfies RawBlockResponseJSON;
    }
}

interface RawBlockResponseJSON {
    raw: string;
}

export { RawBlockResponse, type RawBlockResponseJSON };
