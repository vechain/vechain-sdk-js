import { Hex, HexUInt, type Transaction } from '@vechain/sdk-core';
import { NotDelegatedTransaction } from '@vechain/sdk-errors';
import {
    type GetDelegationSignatureResult,
    type SignTransactionOptions
} from '../types';
import { type HttpClient, HttpMethod } from '../../../http';

/**
 * Retrieves the signature of a delegation transaction from a gasPayer given the endpoint
 * from which to retrieve the signature.
 *
 * @see [Simple Gas Payer Standard](https://github.com/vechain/VIPs/blob/master/vips/VIP-201.md)
 *
 * @param tx - The transaction to delegate.
 * @param gasPayerServiceUrl - The URL of the endpoint of the gasPayer service.
 * @param originAddress - The address of the origin account.
 * @param httpClient - The HTTP client instance used for making HTTP requests.
 * @returns A promise that resolves to the signature of the delegation transaction.
 * @throws {NotDelegatedTransaction}
 */
const _getDelegationSignature = async (
    tx: Transaction,
    gasPayerServiceUrl: string,
    originAddress: string,
    httpClient: HttpClient
): Promise<Uint8Array> => {
    const rawTx = Hex.of(tx.encoded).toString();

    /**
     * The request body for the delegation transaction.
     *
     * @see [Obtaining Gas Payer Signature](https://github.com/vechain/VIPs/blob/master/vips/VIP-201.md#obtaining-gas-payer-signature)
     */
    const sponsorRequestBody = {
        origin: originAddress,
        raw: rawTx
    };

    try {
        const response = (await httpClient.http(
            HttpMethod.POST,
            gasPayerServiceUrl,
            {
                body: sponsorRequestBody
            }
        )) as GetDelegationSignatureResult;

        return HexUInt.of(response.signature.slice(2)).bytes;
    } catch (error) {
        throw new NotDelegatedTransaction(
            '_getDelegationSignature()',
            'Delegation failed: Cannot get signature from gasPayerUrl.',
            {
                gasPayerUrl: gasPayerServiceUrl
            },
            error
        );
    }
};

/**
 * Provide a set of utils for the delegation type.
 * It is a mutual exclusion between gasPayerPrivateKey and gasPayerServiceUrl. (@see SignTransactionOptions)
 *
 * The aim of this handler is to:
 *   - Understand the kind of delegation and the delegation info
 *   - Provide a method to get the delegation signature
 *
 * @param gasPayer - The gasPayer options.
 */
const DelegationHandler = (
    gasPayer?: SignTransactionOptions | null
): {
    isDelegated: () => boolean;
    gasPayerOrUndefined: () => SignTransactionOptions | undefined;
    gasPayerOrNull: () => SignTransactionOptions | null;
    getDelegationSignatureUsingUrl: (
        tx: Transaction,
        originAddress: string,
        httpClient: HttpClient
    ) => Promise<Uint8Array>;
} => {
    // Check if gasPayer is undefined (null or undefined)
    const gasPayerIsUndefined = gasPayer === undefined || gasPayer === null;

    // Check if is delegated by url
    const isDelegatedWithUrl =
        !gasPayerIsUndefined && gasPayer?.gasPayerServiceUrl !== undefined;

    // Check if is delegated by private key
    const isDelegatedWithPrivateKey =
        !gasPayerIsUndefined && gasPayer?.gasPayerPrivateKey !== undefined;

    return {
        /**
         * Check if the transaction is delegated.
         *
         * @returns true if the transaction is delegated, false otherwise.
         */
        isDelegated: (): boolean =>
            isDelegatedWithUrl || isDelegatedWithPrivateKey,

        /**
         * Get the gasPayer options or undefined.
         * (if gasPayer is undefined or null).
         *
         * @returns The gasPayer options or undefined.
         */
        gasPayerOrUndefined: (): SignTransactionOptions | undefined =>
            gasPayerIsUndefined ? undefined : gasPayer,

        /**
         * Get the gasPayer options or null.
         * (if gasPayer is undefined or null).
         *
         * @returns The gasPayer options or null.
         */
        gasPayerOrNull: (): SignTransactionOptions | null =>
            gasPayerIsUndefined ? null : gasPayer,

        /**
         * Retrieves the signature of a delegation transaction from a gasPayer given the endpoint
         * from which to retrieve the signature.
         *
         * @see [Simple Gas Payer Standard](https://github.com/vechain/VIPs/blob/master/vips/VIP-201.md)
         *
         * @param tx - The transaction to delegate.
         * @param originAddress - The address of the origin account.
         * @param httpClient - The HTTP client instance used for making HTTP requests.
         * @returns A promise that resolves to the signature of the delegation transaction.
         * @throws {NotDelegatedTransaction}
         */
        getDelegationSignatureUsingUrl: async (
            tx: Transaction,
            originAddress: string,
            httpClient: HttpClient
        ): Promise<Uint8Array> => {
            // Cannot be delegated by private key
            if (!isDelegatedWithUrl) {
                throw new NotDelegatedTransaction(
                    'DelegationHandler.getDelegationSignatureUsingUrl()',
                    'Delegation with url failed: gasPayerServiceUrl is not defined.',
                    undefined
                );
            }

            return await _getDelegationSignature(
                tx,
                gasPayer?.gasPayerServiceUrl,
                originAddress,
                httpClient
            );
        }
    };
};

export { DelegationHandler };
