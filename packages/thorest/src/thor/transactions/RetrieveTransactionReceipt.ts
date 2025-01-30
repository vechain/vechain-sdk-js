import { type TxId, type BlockId } from '@vechain/sdk-core';
import { type HttpClient, type HttpPath, type HttpQuery } from '../../http';
import {
    GetTxReceiptResponse,
    type GetTxReceiptResponseJSON
} from './GetTxReceiptResponse';
import { type ThorRequest } from '../ThorRequest';
import { type ThorResponse } from '../ThorResponse';
class RetrieveTransactionReceipt
    implements ThorRequest<RetrieveTransactionReceipt, GetTxReceiptResponse>
{
    readonly path: RetrieveTransactionReceiptPath;

    readonly query: RetrieveTransactionReceiptQuery;

    constructor(
        path: RetrieveTransactionReceiptPath,
        query: RetrieveTransactionReceiptQuery
    ) {
        this.path = path;
        this.query = query;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveTransactionReceipt, GetTxReceiptResponse>> {
        const response = await httpClient.get(this.path, this.query);
        const responseBody =
            (await response.json()) as GetTxReceiptResponseJSON;
        return {
            request: this,
            response: new GetTxReceiptResponse(responseBody)
        } satisfies ThorResponse<
            RetrieveTransactionReceipt,
            GetTxReceiptResponse
        >;
    }

    static of(txId: TxId): RetrieveTransactionReceipt {
        return new RetrieveTransactionReceipt(
            new RetrieveTransactionReceiptPath(txId),
            new RetrieveTransactionReceiptQuery(undefined)
        );
    }

    withHead(head?: BlockId): RetrieveTransactionReceipt {
        return new RetrieveTransactionReceipt(
            this.path,
            new RetrieveTransactionReceiptQuery(head)
        );
    }
}

class RetrieveTransactionReceiptPath implements HttpPath {
    readonly txId: TxId;

    constructor(txId: TxId) {
        this.txId = txId;
    }

    get path(): string {
        return `/transactions/${this.txId}/receipt`;
    }
}

class RetrieveTransactionReceiptQuery implements HttpQuery {
    readonly head?: BlockId;

    constructor(head: BlockId | undefined) {
        this.head = head;
    }

    get query(): string {
        return this.head === undefined ? '' : `${this.head}&`;
    }
}

export {
    RetrieveTransactionReceipt,
    RetrieveTransactionReceiptPath,
    RetrieveTransactionReceiptQuery
};
