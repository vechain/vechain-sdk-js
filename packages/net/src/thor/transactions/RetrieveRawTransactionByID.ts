import {
    RetrieveTransactionByIDPath,
    RetrieveTransactionByIDQuery
} from './RetrieveTransactionByID';
import {
    GetRawTxResponse,
    type GetRawTxResponseJSON
} from './GetRawTxResponse';
import { type BlockId, type TxId } from '@vechain/sdk-core';
import { type HttpClient } from '../../http';
import { type ThorRequest } from '../ThorRequest';
import { type ThorResponse } from '../ThorResponse';

class RetrieveRawTransactionByID
    implements ThorRequest<RetrieveRawTransactionByID, GetRawTxResponse>
{
    readonly path: RetrieveRawTransactionByIDPath;

    readonly query: RetrieveRawTransactionByIDQuery;

    constructor(
        path: RetrieveRawTransactionByIDPath,
        query: RetrieveRawTransactionByIDQuery
    ) {
        this.path = path;
        this.query = query;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveRawTransactionByID, GetRawTxResponse>> {
        const response = await httpClient.get(this.path, this.query);
        const responseBody = (await response.json()) as GetRawTxResponseJSON;
        return {
            request: this,
            response: new GetRawTxResponse(responseBody)
        };
    }

    static of(txId: TxId): RetrieveRawTransactionByID {
        return new RetrieveRawTransactionByID(
            new RetrieveRawTransactionByIDPath(txId),
            new RetrieveRawTransactionByIDQuery(null, false)
        );
    }

    withHead(head: BlockId | null = null): RetrieveRawTransactionByID {
        return new RetrieveRawTransactionByID(
            this.path,
            new RetrieveRawTransactionByIDQuery(head, this.query.pending)
        );
    }

    withPending(pending: boolean = true): RetrieveRawTransactionByID {
        return new RetrieveRawTransactionByID(
            this.path,
            new RetrieveRawTransactionByIDQuery(this.query.head, pending)
        );
    }
}

class RetrieveRawTransactionByIDPath extends RetrieveTransactionByIDPath {}

class RetrieveRawTransactionByIDQuery extends RetrieveTransactionByIDQuery {
    get query(): string {
        const head = this.head === null ? '' : `${this.head}&`;
        return `?${head}pending=${this.pending}&raw=true`;
    }
}

export {
    RetrieveRawTransactionByID,
    RetrieveRawTransactionByIDPath,
    RetrieveRawTransactionByIDQuery
};
