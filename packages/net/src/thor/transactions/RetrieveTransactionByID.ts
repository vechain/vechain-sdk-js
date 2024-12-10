import { type BlockId, type TxId } from '@vechain/sdk-core';
import { type HttpClient, type HttpPath, type HttpQuery } from '../../http';
import { GetTxResponse, type GetTxResponseJSON } from './GetTxResponse';
import { type ThorRequest } from '../ThorRequest';
import { type ThorResponse } from '../ThorResponse';

class RetrieveTransactionByID
    implements ThorRequest<RetrieveTransactionByID, GetTxResponse>
{
    readonly path: RetrieveTransactionByIDPath;

    readonly query: RetrieveTransactionByIDQuery;

    constructor(
        path: RetrieveTransactionByIDPath,
        query: RetrieveTransactionByIDQuery
    ) {
        this.path = path;
        this.query = query;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveTransactionByID, GetTxResponse>> {
        const response = await httpClient.get(this.path, this.query);
        const responseBody = (await response.json()) as GetTxResponseJSON;
        return {
            request: this,
            response: new GetTxResponse(responseBody)
        };
    }

    static of(txId: TxId): RetrieveTransactionByID {
        return new RetrieveTransactionByID(
            new RetrieveTransactionByIDPath(txId),
            new RetrieveTransactionByIDQuery(null, false)
        );
    }

    withHead(head: BlockId | null = null): RetrieveTransactionByID {
        return new RetrieveTransactionByID(
            this.path,
            new RetrieveTransactionByIDQuery(head, this.query.pending)
        );
    }

    withPending(pending: boolean = true): RetrieveTransactionByID {
        return new RetrieveTransactionByID(
            this.path,
            new RetrieveTransactionByIDQuery(this.query.head, pending)
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

class RetrieveTransactionByIDQuery implements HttpQuery {
    readonly head: BlockId | null;
    readonly pending: boolean;

    constructor(head: BlockId | null, pending: boolean) {
        this.head = head;
        this.pending = pending;
    }

    get query(): string {
        const head = this.head === null ? '' : `${this.head}&`;
        return `?${head}pending=${this.pending}&raw=false`;
    }
}

export {
    RetrieveTransactionByID,
    RetrieveTransactionByIDPath,
    RetrieveTransactionByIDQuery
};
