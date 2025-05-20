import { type HttpClient, type HttpPath } from '@http';
import {
    RegularBlockResponse,
    type RegularBlockResponseJSON
} from '@thor/blocks';
import { type ThorRequest, type ThorResponse } from '../utils';
import { type Revision } from '@vechain/sdk-core';

class RetrieveRegularBlock
    implements ThorRequest<RetrieveRegularBlock, RegularBlockResponse>
{
    public readonly path: RetrieveRegularBlockPath;

    constructor(path: RetrieveRegularBlockPath) {
        this.path = path;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveRegularBlock, RegularBlockResponse>> {
        const response = await httpClient.get(this.path, { query: '' });
        const responseJSON =
            (await response.json()) as RegularBlockResponseJSON;
        return {
            request: this,
            response: new RegularBlockResponse(responseJSON)
        };
    }

    static of(revision: Revision): RetrieveRegularBlock {
        return new RetrieveRegularBlock(new RetrieveRegularBlockPath(revision));
    }
}

class RetrieveRegularBlockPath implements HttpPath {
    readonly revision: Revision;

    constructor(revision: Revision) {
        this.revision = revision;
    }

    get path(): string {
        return `/blocks/${this.revision}`;
    }
}

export { RetrieveRegularBlock, RetrieveRegularBlockPath };
