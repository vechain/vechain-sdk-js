import { HexUInt } from '@vcdm';
import { type HttpClient, type HttpPath } from '@http';
import {
    ThorError,
    type ThorRequest,
    type ThorResponse,
    TXID,
    type TXIDJSON
} from '@thor';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/transactions/SendTransaction.ts!';

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
        const response = await httpClient.post(
            SendTransaction.PATH,
            { query: '' },
            {
                raw: HexUInt.of(this.encodedTransaction).toString()
            }
        );
        if (response.ok) {
            const json = (await response.json()) as TXIDJSON;
            try {
                return {
                    request: this,
                    response: new TXID(json)
                } satisfies ThorResponse<SendTransaction, TXID>;
            } catch (error) {
                throw new ThorError(
                    fqp,
                    'Bad response.',
                    {
                        url: response.url,
                        body: json
                    },
                    error instanceof Error ? error : undefined,
                    response.status
                );
            }
        } else {
            throw new ThorError(
                fqp,
                await response.text(),
                {
                    url: response.url
                },
                undefined,
                response.status
            );
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
