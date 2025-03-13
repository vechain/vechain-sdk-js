import { Address, HexUInt, Units, VET } from '@vechain/sdk-core';

class Clause {
    readonly to?: Address;
    readonly value: VET;
    readonly data: HexUInt;

    constructor(json: ClauseJSON) {
        this.to =
            json.to !== undefined && json.to != null
                ? Address.of(json.to)
                : undefined;
        this.value = VET.of(json.value, Units.wei);
        this.data = HexUInt.of(json.data);
    }

    toJSON(): ClauseJSON {
        return {
            to:
                this.to !== undefined && this.to !== null
                    ? this.to.toString()
                    : undefined,
            value: HexUInt.of(this.value.wei).toString(),
            data: this.data.toString()
        } satisfies ClauseJSON;
    }
}

interface ClauseJSON {
    to?: string | null;
    value: string;
    data: string;
}

export { Clause, type ClauseJSON };
