import { type HttpClient, type HttpPath } from '@http';
import { type Address, type BlockId } from '@vechain/sdk-core';
import { GetStorageResponse } from './GetStorageResponse';
import { ThorError, type ThorRequest, type ThorResponse } from '@thor';
import { type GetStorageResponseJSON } from './GetStorageResponseJSON';

/**
 * Full-Qualified Path
 */
const FQP =
    'packages/thorest/src/thor/accounts/RetrieveStoragePositionValue.ts!';

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
        const fqp = `${FQP}askTo(httpClient: HttpClient): Promise<ThorResponse<RetrieveStoragePositionValue, GetStorageResponse>>`;
        const response = await httpClient.get(this.path, { query: '' });
        if (response.ok) {
            const json = (await response.json()) as GetStorageResponseJSON;
            try {
                return {
                    request: this,
                    response: new GetStorageResponse(json)
                };
            } catch (error) {
                throw new ThorError(
                    fqp,
                    'Bad response.',
                    {
                        url: response.url,
                        body: json
                    },
                    error instanceof Error ? error : undefined,
                    response.status
                );
            }
        }
        throw new ThorError(
            fqp,
            'Bad response.',
            {
                url: response.url
            },
            undefined,
            response.status
        );
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
