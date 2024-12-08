import { HexUInt, TxId } from '@vechain/sdk-core';
import { type HttpClient, type HttpPath } from '../../http';
import { type ThorRequest } from '../ThorRequest';
import { type ThorResponse } from '../ThorResponse';

class SendTransaction implements ThorRequest<SendTransaction, TxId> {
    static readonly PATH: HttpPath = { path: '/transactions' };

    readonly encoded: Uint8Array;

    constructor(encoded: Uint8Array) {
        this.encoded = encoded;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<SendTransaction, TxId>> {
        const response = await httpClient.post(
            SendTransaction.PATH,
            { query: '' },
            {
                raw: HexUInt.of(this.encoded).toString()
            }
        );
        const responseBody =
            (await response.json()) as SendTransactionResponseJSON;
        return {
            request: this,
            response: TxId.of(responseBody.id)
        } satisfies ThorResponse<SendTransaction, TxId>;
    }

    static of(encoded: Uint8Array): SendTransaction {
        return new SendTransaction(encoded);
    }
}

interface SendTransactionResponseJSON {
    id: string;
}

export { SendTransaction };
