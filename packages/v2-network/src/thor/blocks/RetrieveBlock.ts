import { type HttpClient, type HttpPath } from '../../http';
import { type ThorRequest } from '../ThorRequest';
import { type ThorResponse } from '../ThorResponse';
import {
    RegularBlockResponse,
    type RegularBlockResponseJSON
} from './RegularBlockResponse.';
import { type Revision } from '@vechain/sdk-core';

class RetrieveBlock
    implements ThorRequest<RetrieveBlock, RegularBlockResponse>
{
    public readonly path: RetrieveBlockPath;

    constructor(path: RetrieveBlockPath) {
        this.path = path;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveBlock, RegularBlockResponse>> {
        const response = await httpClient.get(this.path);
        const responseBody =
            (await response.json()) as RegularBlockResponseJSON;
        return {
            request: this,
            response: new RegularBlockResponse(responseBody)
        };
    }

    static of(revision: Revision): RetrieveBlock {
        return new RetrieveBlock(new RetrieveBlockPath(revision));
    }
}

class RetrieveBlockPath implements HttpPath {
    static readonly Path = '/blocks';

    readonly revision: Revision;

    constructor(revision: Revision) {
        this.revision = revision;
    }

    get path(): string {
        return `${RetrieveBlockPath.Path}/${this.revision}`;
    }
}

export { RetrieveBlock, RetrieveBlockPath };
