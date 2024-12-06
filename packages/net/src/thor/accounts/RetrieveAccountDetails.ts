import { type HttpClient, type HttpPath } from '../../http';
import { type ThorRequest } from '../ThorRequest';
import { type ThorResponse } from '../ThorResponse';
import {
    GetAccountResponse,
    type GetAccountResponseJSON
} from './GetAccountResponse';
import { type Address } from '@vechain/sdk-core';

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
        const response = await httpClient.get(this.path, { query: '' });
        const responseBody = (await response.json()) as GetAccountResponseJSON;
        return {
            request: this,
            response: new GetAccountResponse(responseBody)
        };
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
