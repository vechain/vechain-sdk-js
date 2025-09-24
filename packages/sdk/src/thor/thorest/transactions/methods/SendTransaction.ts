import { HexUInt } from '@common/vcdm';
import { type HttpClient, type HttpPath } from '@common/http';
import {
    ThorError,
    type ThorRequest,
    type ThorResponse,
    TXID
} from '@thor/thorest';
import { type TXIDJSON } from '@thor/thorest/json';
import { handleHttpError } from '@thor/thorest/utils';
import { log } from '@common/logging';

/**
 * Full-Qualified Path
 */
const FQP =
    'packages/sdk/src/thor/thorest/transactions/methods/SendTransaction.ts!';

/**
 * [Send a transaction](http://localhost:8669/doc/stoplight-ui/#/paths/transactions/post)
 *
 * This endpoint allows you to send a transaction to the blockchain. The transaction must be signed and RLP encoded.
 */
class SendTransaction implements ThorRequest<SendTransaction, TXID> {
    /**
     * Represents the HTTP path configuration for a specific API endpoint.
     */
    protected static readonly PATH: HttpPath = { path: '/transactions' };

    /**
     * Represents a serialized transaction in a binary format.
     *
     * @type {Uint8Array}
     */
    protected readonly encodedTransaction: Uint8Array;

    /**
     * Constructs a new instance of the class with the provided encoded transaction data.
     *
     * @param {Uint8Array} encoded - The encoded transaction data to initialize the instance with.
     */
    protected constructor(encoded: Uint8Array) {
        this.encodedTransaction = encoded;
    }

    /**
     * Asynchronously sends the transaction to the Thor network using the provided HTTP client.
     *
     * @param {HttpClient} httpClient - An HTTP client used to perform the request.
     * @return {Promise<ThorResponse<SendTransaction, TXID>>}
     * Returns a promise that resolves to a ThorResponse containing the transaction ID.
     * @throws ThorError if the response is invalid or the request fails.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<SendTransaction, TXID>> {
        const fqp = `${FQP}askTo(httpClient: HttpClient): Promise<ThorResponse<SendTransaction, TXID>>`;
        try {
            const response = await httpClient.post(
                SendTransaction.PATH,
                { query: '' },
                {
                    raw: HexUInt.of(this.encodedTransaction).toString()
                }
            );
            let raw: string | undefined;
            try {
                raw = await response.text();
                const json = JSON.parse(raw) as TXIDJSON;
                return {
                    request: this,
                    response: new TXID(json)
                } satisfies ThorResponse<SendTransaction, TXID>;
            } catch (error) {
                throw new ThorError(
                    fqp,
                    error instanceof Error ? error.message : 'Bad response.',
                    {
                        url: response.url,
                        // include raw payload to aid debugging (may be non‑JSON)
                        body: typeof raw !== 'undefined' ? raw : undefined
                    },
                    error instanceof Error ? error : undefined,
                    response.status
                );
            }
        } catch (error) {
            throw handleHttpError(fqp, error);
        }
    }

    /**
     * Creates a new instance of SendTransaction using the provided encoded transaction data.
     *
     * @param {Uint8Array} encoded - The encoded transaction data to initialize the instance with.
     * @return {SendTransaction} A new instance of SendTransaction with the specified encoded transaction data.
     */
    static of(encoded: Uint8Array): SendTransaction {
        return new SendTransaction(encoded);
    }
}

export { SendTransaction };
