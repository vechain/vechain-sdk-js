import { Address, StorageKey, UInt } from '@vechain/sdk-core/src';

class StorageRangeOption {
    readonly address: Address;
    readonly keyStart?: StorageKey;
    readonly maxResult?: UInt;
    readonly target: string; // Path class?

    constructor(json: StorageRangeOptionJSON) {
        this.address = Address.of(json.address);
        this.keyStart =
            json.keyStart === undefined
                ? undefined
                : StorageKey.of(json.keyStart);
        this.maxResult =
            json.maxResult === undefined ? undefined : UInt.of(json.maxResult);
        this.target = json.target;
    }

    toJSON(): StorageRangeOptionJSON {
        return {
            address: this.address.toString(),
            keyStart: this.keyStart?.toString(),
            maxResult: this.maxResult?.valueOf(),
            target: this.target
        } satisfies StorageRangeOptionJSON;
    }
}

interface StorageRangeOptionJSON {
    address: string;
    keyStart?: string;
    maxResult?: number;
    target: string;
}

export { StorageRangeOption, type StorageRangeOptionJSON };
