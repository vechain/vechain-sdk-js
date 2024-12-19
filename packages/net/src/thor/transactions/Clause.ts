import { Address, HexUInt, VET } from '@vechain/sdk-core';

class Clause {
    readonly to: Address | null;
    readonly value: VET;
    readonly data: HexUInt;

    constructor(json: ClauseJSON) {
        this.to = json.to === null ? null : Address.of(json.to);
        this.value = VET.of(json.value);
        this.data = HexUInt.of(json.data);
    }

    toJSON(): ClauseJSON {
        return {
            to: this.to === null ? null : this.to.toString(),
            value: HexUInt.of(this.value.wei).toString(),
            data: this.data.toString()
        } satisfies ClauseJSON;
    }
}

interface ClauseJSON {
    to: string | null;
    value: string;
    data: string;
}

export { Clause, type ClauseJSON };
