import { type TxId, type BlockId } from '@vechain/sdk-core';
import { type HttpClient } from '@http';
import { GetRawTxResponse } from './GetRawTxResponse';
import {
    type GetRawTxResponseJSON,
    type ThorRequest,
    type ThorResponse
} from '@thor';
import { RetrieveTransactionPath } from '@thor/transactions/RetrieveTransactionPath';
import { RetrieveTransactionQuery } from '@thor/transactions/RetrieveTransactionQuery';

class RetrieveRawTransactionByID
    implements ThorRequest<RetrieveRawTransactionByID, GetRawTxResponse>
{
    readonly path: RetrieveTransactionPath;

    readonly query: Query;

    constructor(path: RetrieveTransactionPath, query: Query) {
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
            new RetrieveTransactionPath(txId),
            new Query(undefined, false)
        );
    }

    withHead(head?: BlockId): RetrieveRawTransactionByID {
        return new RetrieveRawTransactionByID(
            this.path,
            new Query(head, this.query.pending)
        );
    }

    withPending(pending: boolean = true): RetrieveRawTransactionByID {
        return new RetrieveRawTransactionByID(
            this.path,
            new Query(this.query.head, pending)
        );
    }
}

class Query extends RetrieveTransactionQuery {
    get query(): string {
        const head = this.head === undefined ? '' : `${this.head}&`;
        return `?${head}pending=${this.pending}&raw=true`;
    }
}

export { RetrieveRawTransactionByID };
