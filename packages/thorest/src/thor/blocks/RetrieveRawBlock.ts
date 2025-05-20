import { type HttpClient, type HttpPath } from '@http';
import { RawBlockResponse, type RawBlockResponseJSON } from '@thor/blocks';
import { type ThorRequest, type ThorResponse } from '../utils';
import { type Revision } from '@vechain/sdk-core';

class RetrieveRawBlock
    implements ThorRequest<RetrieveRawBlock, RawBlockResponse>
{
    public readonly path: RetrieveRawBlockPath;

    constructor(path: RetrieveRawBlockPath) {
        this.path = path;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveRawBlock, RawBlockResponse>> {
        const response = await httpClient.get(this.path, {
            query: '?raw=true'
        });
        const responseJSON = (await response.json()) as RawBlockResponseJSON;
        return {
            request: this,
            response: new RawBlockResponse(responseJSON)
        };
    }

    static of(revision: Revision): RetrieveRawBlock {
        return new RetrieveRawBlock(new RetrieveRawBlockPath(revision));
    }
}

class RetrieveRawBlockPath implements HttpPath {
    readonly revision: Revision;

    constructor(revision: Revision) {
        this.revision = revision;
    }

    get path(): string {
        return `/blocks/${this.revision}`;
    }
}

export { RetrieveRawBlock, RetrieveRawBlockPath };
