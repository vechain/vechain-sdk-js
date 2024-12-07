import { TxId } from '@vechain/sdk-core';
import { type HttpClient, type HttpPath } from '../../http';
import { type ThorRequest } from '../ThorRequest';
import { type ThorResponse } from '../ThorResponse';

class SendTransaction implements ThorRequest<SendTransaction, TxId> {
    static readonly PATH: HttpPath = { path: '/transactions' };

    readonly body: unknown;

    constructor(body: unknown) {
        this.body = body;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<SendTransaction, TxId>> {
        const response = await httpClient.post(
            SendTransaction.PATH,
            { query: '' },
            this.body
        );
        const responseBody = await response.text();
        return {
            request: this,
            response: TxId.of(responseBody)
        } satisfies ThorResponse<SendTransaction, TxId>;
    }

    static of(body: unknown): SendTransaction {
        return new SendTransaction(body);
    }
}

export { SendTransaction };
