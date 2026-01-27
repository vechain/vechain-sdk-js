import { FetchHttpClient, type HttpClient } from '@common/http';
import { AddressLike, Hex } from '@common/vcdm';
import { type TransactionRequest } from '@thor/thor-client/model/transactions';
import { log } from '@common/logging';
import { Secp256k1 } from '@common/cryptography';
import { VIP191Error } from '@common/errors/VIP191Error';
import { IllegalArgumentError } from '@common/errors';
import { TransactionBodyEncoder } from '@common/encoding/rlp/TransactionBodyEncoder';

/**
 * JSON representation of the response from the VIP-191 service.
 */
interface VIP191ResponseJSON {
    /**
     * The gas sponsored signature.
     */
    signature: string;
}

/**
 * A client for the VIP-191 remote gas signer service.
 */
class VIP191Client {
    private readonly httpClient: HttpClient;

    /**
     * Constructs a new VIP-191 client.
     * @param {FetchHttpClient} httpClient - The HTTP client to use for the VIP-191 service.
     */
    constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
    }

    /**
     * Get the URL of the VIP-191 gas payer service.
     */
    public get serviceUrl(): URL {
        return this.httpClient.baseURL;
    }

    /**
     * Creates a new VIP-191 client from a string URL.
     * @param {string} serviceUrl - The URL of the VIP-191 gas payer service.
     * @returns {VIP191Client} A new VIP-191 client.
     * @throws {IllegalArgumentError} If the URL is invalid.
     */
    public static of(serviceUrl: string): VIP191Client {
        try {
            return new VIP191Client(new FetchHttpClient(new URL(serviceUrl)));
        } catch (error) {
            throw new IllegalArgumentError(
                'VIP191Client.of',
                'Invalid VIP-191 URL',
                { serviceUrl },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Checks if the object is a valid VIP-191 response.
     * @param {unknown} object - The object to check.
     * @returns {boolean} True if the object is a valid remote gas signer response, false otherwise.
     */
    private isVIP191Response(object: unknown): object is VIP191ResponseJSON {
        return (
            typeof object === 'object' &&
            object !== null &&
            'signature' in object &&
            typeof object.signature === 'string'
        );
    }

    /**
     * Requests a signature from the VIP-191 service.
     * @param {TransactionRequest} transactionRequest - The transaction request to sign.
     * @param {Address} sender - The sender/origin address.
     * @returns {Promise<Hex>} The gas payer signature.
     * @throws {VIP191Error} If the VIP-191 service returns an error
     */
    public async requestSignature(
        sender: AddressLike,
        transactionRequest: TransactionRequest
    ): Promise<Hex> {
        // check if transaction is delegated
        if (!transactionRequest.isDelegated) {
            throw new VIP191Error(
                'VIP191Client.requestGasPayerSignature',
                'Transaction is not delegated, cannot request signature from VIP-191 service'
            );
        }
        // build http post request body
        // encode the transaction request to hex - without signature
        const encodeTx = Hex.of(
            TransactionBodyEncoder.encodeTransactionBody(transactionRequest)
        );
        const vip191Body = {
            origin: sender.toString(),
            raw: encodeTx.toString()
        };
        try {
            const response = await this.httpClient.post(
                { path: '' },
                { query: '' },
                vip191Body
            );
            // check the response status
            if (!response.ok) {
                log.error({
                    message:
                        'Failed to sign remote gas sponsorship - VIP-191 service returned non 200 status code',
                    source: 'VIP191Client.requestGasPayerSignature',
                    context: {
                        request: transactionRequest,
                        error: response.statusText
                    }
                });
                throw new VIP191Error(
                    'VIP191Client.requestGasPayerSignature',
                    `Failed to sign remote gas sponsorship: ${response.statusText}`,
                    { request: transactionRequest, error: response.statusText }
                );
            }
            // check response body is valid JSON
            const responseBody = await response.json();
            if (!this.isVIP191Response(responseBody)) {
                log.error({
                    message: 'Remote signer did not return a valid response',
                    source: 'RemoteGasSigner.sign',
                    context: { responseBody }
                });
                throw new VIP191Error(
                    'VIP191Client.requestGasPayerSignature',
                    'Remote signer did not return a valid response',
                    { request: transactionRequest, responseBody }
                );
            }
            // check response body contains a signature
            if (
                responseBody.signature === undefined ||
                typeof responseBody.signature !== 'string'
            ) {
                log.error({
                    message: 'Remote signer did not return a signature field',
                    source: 'RemoteGasSigner.sign',
                    context: { responseBody }
                });
                throw new VIP191Error(
                    'VIP191Client.requestGasPayerSignature',
                    'Remote signer did not return a signature',
                    { responseBody }
                );
            }
            // parse the signature field and check if it is valid hex
            if (!Hex.isValid(responseBody.signature)) {
                log.error({
                    message: 'Remote signer returned an invalid signature',
                    source: 'RemoteGasSigner.sign',
                    context: { responseBody }
                });
                throw new VIP191Error(
                    'VIP191Client.requestGasPayerSignature',
                    'Remote signer returned an invalid signature',
                    { responseBody }
                );
            }
            const signature = Hex.of(responseBody.signature);
            // check if the signature is valid secp256k1 signature
            if (signature.bytes.length !== Secp256k1.SIGNATURE_LENGTH) {
                log.error({
                    message:
                        'Remote signer returned an invalid signature length',
                    source: 'RemoteGasSigner.sign',
                    context: { responseBody }
                });
                throw new VIP191Error(
                    'VIP191Client.requestGasPayerSignature',
                    'Remote signer returned an invalid signature length',
                    { responseBody }
                );
            }
            // return the signature
            return signature;
        } catch (error) {
            if (error instanceof VIP191Error) {
                throw error;
            }
            log.error({
                message: 'Failed to sign remote gas sponsorship',
                source: 'RemoteGasSigner.sign',
                context: { request: transactionRequest, error }
            });
            throw new VIP191Error(
                'RemoteGasSigner.sign',
                'Failed to sign remote gas sponsorship',
                { request: transactionRequest, error }
            );
        }
    }
}

export { VIP191Client };
