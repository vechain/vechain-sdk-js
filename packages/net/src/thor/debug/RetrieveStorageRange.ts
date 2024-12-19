import type { HttpClient, HttpPath } from '../../http';
import { type ThorRequest } from '../ThorRequest';
import {
    StorageRangeOption,
    type StorageRangeOptionJSON
} from './StorageRangeOption';
import { type ThorResponse } from '../ThorResponse';
import { type StorageRange } from './StorageRange';

class RetrieveStorageRange
    implements ThorRequest<RetrieveStorageRange, StorageRange>
{
    static readonly PATH: HttpPath = { path: '/debug/storage-range' };

    readonly request: StorageRangeOption;

    constructor(request: StorageRangeOption) {
        this.request = request;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveStorageRange, StorageRange>> {
        const response = await httpClient.post(
            RetrieveStorageRange.PATH,
            { query: '' },
            this.request.toJSON()
        );
        const responseBody = (await response.json()) as StorageRange;
        return {
            request: this,
            response: responseBody
        };
    }

    static of(request: StorageRangeOptionJSON): RetrieveStorageRange {
        return new RetrieveStorageRange(new StorageRangeOption(request));
    }
}

export { RetrieveStorageRange };
