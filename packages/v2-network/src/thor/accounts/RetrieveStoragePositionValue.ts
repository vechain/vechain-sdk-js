import { type HttpClient, type HttpPath } from '../../http';
import { type Address, type BlockId } from '@vechain/sdk-core';
import { type ThorRequest } from '../ThorRequest';
import {
    StoragePositionValue,
    type StoragePositionValueJSON
} from './StoragePositionValue';
import { type ThorResponse } from '../ThorResponse';

class RetrieveStoragePositionValue
    implements ThorRequest<RetrieveStoragePositionValue, StoragePositionValue>
{
    readonly path: RetrieveStoragePositionValuePath;

    constructor(path: RetrieveStoragePositionValuePath) {
        this.path = path;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<
        ThorResponse<RetrieveStoragePositionValue, StoragePositionValue>
    > {
        const response = await httpClient.get(this.path);
        const responseBody =
            (await response.json()) as StoragePositionValueJSON;
        return {
            request: this,
            response: new StoragePositionValue(responseBody)
        };
    }

    static of(address: Address, key: BlockId): RetrieveStoragePositionValue {
        return new RetrieveStoragePositionValue(
            new RetrieveStoragePositionValuePath(address, key)
        );
    }
}

class RetrieveStoragePositionValuePath implements HttpPath {
    readonly address: Address;

    readonly key: BlockId;

    constructor(address: Address, key: BlockId) {
        this.address = address;
        this.key = key;
    }

    get path(): string {
        return `/accounts/${this.address}/storage/${this.key}`;
    }
}

export { RetrieveStoragePositionValue, RetrieveStoragePositionValuePath };
