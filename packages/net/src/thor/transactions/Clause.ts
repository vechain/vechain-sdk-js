import { Address, HexUInt, VET } from '@vechain/sdk-core';

class Clause {
    readonly to?: Address;
    readonly value: VET;
    readonly data: HexUInt;

    constructor(json: ClauseJSON) {
        this.to = json.to !== undefined ? Address.of(json.to) : undefined;
        this.value = VET.of(json.value);
        this.data = HexUInt.of(json.data);
    }

    toJSON(): ClauseJSON {
        return {
            to: this.to?.toString(),
            value: HexUInt.of(this.value.wei).toString(),
            data: this.data.toString()
        } satisfies ClauseJSON;
    }
}

interface ClauseJSON {
    to?: string;
    value: string;
    data: string;
}

export { Clause, type ClauseJSON };
