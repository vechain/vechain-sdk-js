import { type HttpClient } from '@common/http';
import { Hex } from '@common/vcdm';
import { type TransactionRequest } from '@thor/thor-client/model/transactions';
import { RemoteGasSignerError } from '@common/errors/RemoteGasSignerError';
import { log } from '@common/logging';
import { Secp256k1 } from '@common/cryptography';
import { TransactionRequestRLPCodec } from '@thor/thor-client/rlp/TransactionRequestRLPCodec';

const FQP = 'packages/sdk/src/thor/vip191/RemoteGasSignerClient.ts!';

/**
 * JSON representation of the response from the remote gas signer service.
 */
interface RemoteGasSignerResponseJSON {
    /**
     * The gas sponsored signature.
     */
    signature: string;
}

/**
 * A client for the VIP-191 remote gas signer service.
 */
class RemoteGasSignerClient {
    private readonly httpClient: HttpClient;

    /**
     * Constructs a new remote gas signer client.
     * @param {HttpClient} httpClient - The HTTP client to use for the remote gas signer service.
     */
    constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
    }

    /**
     * Checks if the object is a valid remote gas signer response.
     * @param {unknown} object - The object to check.
     * @returns {boolean} True if the object is a valid remote gas signer response, false otherwise.
     */
    private isRemoteGasSignerResponse(
        object: unknown
    ): object is RemoteGasSignerResponseJSON {
        return (
            typeof object === 'object' &&
            object !== null &&
            'signature' in object &&
            typeof object.signature === 'string'
        );
    }

    /**
     * Requests a signature from the remote gas signer service.
     * @param {TransactionRequest} transactionRequest - The transaction request to sign.
     * @returns {Promise<Hex>} The signature.
     * @throws {RemoteGasSignerError} If the remote gas signer service returns an error
     */
    public async requestSignature(
        transactionRequest: TransactionRequest
    ): Promise<Hex> {
        // build http post request body
        // encode the transaction request to hex - note as its unsigned, we need to encode it to hash
        const encodeTx = Hex.of(
            TransactionRequestRLPCodec.encode(transactionRequest, true)
        );
        const vip191Body = {
            origin: transactionRequest.gasSponsorshipRequester?.toString(),
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
                throw new RemoteGasSignerError(
                    `${FQP}sign(transactionRequest: TransactionRequest)`,
                    `Failed to sign remote gas sponsorship: ${response.statusText}`,
                    { request: transactionRequest, error: response.statusText }
                );
            }
            // check response body is valid JSON
            const responseBody = await response.json();
            if (!this.isRemoteGasSignerResponse(responseBody)) {
                log.error({
                    message: 'Remote signer did not return a valid response',
                    source: 'RemoteGasSigner.sign',
                    context: { responseBody }
                });
                throw new RemoteGasSignerError(
                    `${FQP}sign(transactionRequest: TransactionRequest)`,
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
                throw new RemoteGasSignerError(
                    `${FQP}sign(transactionRequest: TransactionRequest)`,
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
                throw new RemoteGasSignerError(
                    `${FQP}sign(transactionRequest: TransactionRequest)`,
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
                throw new RemoteGasSignerError(
                    `${FQP}sign(transactionRequest: TransactionRequest)`,
                    'Remote signer returned an invalid signature length',
                    { responseBody }
                );
            }
            // return the signature
            return signature;
        } catch (error) {
            log.error({
                message: 'Failed to sign remote gas sponsorship',
                source: 'RemoteGasSigner.sign',
                context: { request: transactionRequest, error }
            });
            if (error instanceof RemoteGasSignerError) {
                throw error;
            }
            throw new RemoteGasSignerError(
                'RemoteGasSigner.sign',
                'Failed to sign remote gas sponsorship',
                { request: transactionRequest, error }
            );
        }
    }
}

export { RemoteGasSignerClient, type RemoteGasSignerResponseJSON };
