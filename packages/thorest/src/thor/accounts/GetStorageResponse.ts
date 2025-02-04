import { StorageKey } from '@vechain/sdk-core/src';

class GetStorageResponse {
    readonly value: StorageKey;

    constructor(json: GetStorageResponseJSON) {
        this.value = StorageKey.of(json.value);
    }

    toJSON(): GetStorageResponseJSON {
        return {
            value: this.value.toString()
        } satisfies GetStorageResponseJSON;
    }
}

interface GetStorageResponseJSON {
    value: string;
}

export { GetStorageResponse, type GetStorageResponseJSON };
