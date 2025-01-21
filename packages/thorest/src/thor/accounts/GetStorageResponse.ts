import { ThorId } from '@vechain/sdk-core';

class GetStorageResponse {
    readonly value: ThorId;

    constructor(json: GetStorageResponseJSON) {
        this.value = ThorId.of(json.value);
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
