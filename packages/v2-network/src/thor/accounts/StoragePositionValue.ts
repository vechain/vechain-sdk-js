import { HexUInt } from '@vechain/sdk-core';

interface StoragePositionValueJSON {
    value: string;
}

class StoragePositionValue {
    readonly value: HexUInt;

    constructor(json: StoragePositionValueJSON) {
        this.value = HexUInt.of(json.value);
    }

    toJSON(): StoragePositionValueJSON {
        return {
            value: this.value.toString()
        };
    }
}

export { StoragePositionValue, type StoragePositionValueJSON };
