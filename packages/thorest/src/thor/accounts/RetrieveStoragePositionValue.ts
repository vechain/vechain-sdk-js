import { type HttpClient, type HttpPath } from '@http';
import { type Address, type BlockId } from '@vechain/sdk-core';
import {
    GetStorageResponse,
    type GetStorageResponseJSON
} from '@thor/accounts';
import { type ThorRequest, type ThorResponse } from '../utils';

class RetrieveStoragePositionValue
    implements ThorRequest<RetrieveStoragePositionValue, GetStorageResponse>
{
    readonly path: RetrieveStoragePositionValuePath;

    constructor(path: RetrieveStoragePositionValuePath) {
        this.path = path;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveStoragePositionValue, GetStorageResponse>> {
        const response = await httpClient.get(this.path, { query: '' });
        const responseBody = (await response.json()) as GetStorageResponseJSON;
        return {
            request: this,
            response: new GetStorageResponse(responseBody)
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
