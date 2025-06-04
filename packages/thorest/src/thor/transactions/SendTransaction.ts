import { HexUInt } from '@vechain/sdk-core';
import { type HttpClient, type HttpPath } from '@http';
import { type ThorRequest, type ThorResponse } from '@thor';
import { TXID, type TXIDJSON } from '@thor/model/TXID';

class SendTransaction implements ThorRequest<SendTransaction, TXID> {
    static readonly PATH: HttpPath = { path: '/transactions' };

    readonly encoded: Uint8Array;

    constructor(encoded: Uint8Array) {
        this.encoded = encoded;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<SendTransaction, TXID>> {
        const response = await httpClient.post(
            SendTransaction.PATH,
            { query: '' },
            {
                raw: HexUInt.of(this.encoded).toString()
            }
        );
        const json = (await response.json()) as TXIDJSON;
        return {
            request: this,
            response: new TXID(json)
        } satisfies ThorResponse<SendTransaction, TXID>;
    }

    static of(encoded: Uint8Array): SendTransaction {
        return new SendTransaction(encoded);
    }
}

export { SendTransaction };
