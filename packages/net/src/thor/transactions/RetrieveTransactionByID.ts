import { type TxId } from '@vechain/sdk-core';
import { type HttpClient, type HttpPath } from '../../http';
import { GetTxResponse, type GetTxResponseJSON } from './GetTxResponse';
import { type ThorRequest } from '../ThorRequest';
import { type ThorResponse } from '../ThorResponse';

class RetrieveTransactionByID
    implements ThorRequest<RetrieveTransactionByID, GetTxResponse>
{
    readonly path: RetrieveTransactionByIDPath;

    constructor(path: RetrieveTransactionByIDPath) {
        this.path = path;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveTransactionByID, GetTxResponse>> {
        const response = await httpClient.get(this.path);
        const responseBody = (await response.json()) as GetTxResponseJSON;
        return {
            request: this,
            response: new GetTxResponse(responseBody)
        };
    }

    static of(txId: TxId): RetrieveTransactionByID {
        return new RetrieveTransactionByID(
            new RetrieveTransactionByIDPath(txId)
        );
    }
}

class RetrieveTransactionByIDPath implements HttpPath {
    readonly txId: TxId;

    constructor(txId: TxId) {
        this.txId = txId;
    }

    get path(): string {
        return `/transactions/${this.txId}`;
    }
}

export { RetrieveTransactionByID, RetrieveTransactionByIDPath };
