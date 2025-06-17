import { type HttpClient, type HttpPath } from '@http';
import { GetAccountResponse } from '@thor/accounts';
import { ThorError, type ThorRequest, type ThorResponse } from '@thor';
import { type Address } from '@vechain/sdk-core';
import { GetAccountResponseJSON } from './GetAccountResponseJSON';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/accounts/RetrieveAccountDetails.ts!';

class RetrieveAccountDetails
    implements ThorRequest<RetrieveAccountDetails, GetAccountResponse>
{
    readonly path: RetrieveAccountDetailsPath;

    constructor(path: RetrieveAccountDetailsPath) {
        this.path = path;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveAccountDetails, GetAccountResponse>> {
        const fqp = `${FQP}askTo(httpClient: HttpClient): Promise<ThorResponse<RetrieveAccountDetails, GetAccountResponse>>`;
        const response = await httpClient.get(this.path, { query: '' });
        if (response.ok) {
            const json = (await response.json()) as GetAccountResponseJSON;
            try {
                return {
                    request: this,
                    response: new GetAccountResponse(json)
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

    static of(address: Address): RetrieveAccountDetails {
        return new RetrieveAccountDetails(
            new RetrieveAccountDetailsPath(address)
        );
    }
}

class RetrieveAccountDetailsPath implements HttpPath {
    readonly address: Address;

    constructor(address: Address) {
        this.address = address;
    }

    get path(): string {
        return `/accounts/${this.address}`;
    }
}

export { RetrieveAccountDetails, RetrieveAccountDetailsPath };
