import { HexUInt } from '@common/vcdm';
import { type HttpClient, type HttpPath } from '@common/http';
import { type ThorRequest, type ThorResponse, TXID } from '@thor/thorest';
import { type TXIDJSON } from '@thor/thorest/json';
import { parseResponseHandler } from '@thor/thorest/utils/ParseResponseHandler';

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
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<SendTransaction, TXID>> {
        const fqp = 'SendTransaction.askTo';
        // do http post request - this will throw an error if the request fails
        const response = await httpClient.post(
            SendTransaction.PATH,
            { query: '' },
            {
                raw: HexUInt.of(this.encodedTransaction).toString()
            }
        );
        // parse the non nullable response - this will throw an error if the response cannot be parsed
        const txIdResponse = await parseResponseHandler<TXID, TXIDJSON>(
            fqp,
            response,
            TXID,
            false
        );
        // return the response
        return {
            request: this,
            response: txIdResponse
        };
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
