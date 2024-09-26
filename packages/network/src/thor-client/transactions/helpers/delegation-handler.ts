import { Hex, type Transaction } from '@vechain/sdk-core';
import { NotDelegatedTransaction } from '@vechain/sdk-errors';
import {
    type GetDelegationSignatureResult,
    type SignTransactionOptions
} from '../types';
import { type IHttpClient } from '../../../utils';

/**
 * Retrieves the signature of a delegation transaction from a delegator given the endpoint
 * from which to retrieve the signature.
 *
 * @see [Simple Gas Payer Standard](https://github.com/vechain/VIPs/blob/master/vips/VIP-201.md)
 *
 * @param tx - The transaction to delegate.
 * @param delegatorUrl - The URL of the endpoint of the delegator.
 * @param originAddress - The address of the origin account.
 * @param httpClient - The HTTP client instance used for making HTTP requests.
 * @returns A promise that resolves to the signature of the delegation transaction.
 * @throws {NotDelegatedTransaction}
 */
const _getDelegationSignature = async (
    tx: Transaction,
    delegatorUrl: string,
    originAddress: string,
    httpClient: IHttpClient
): Promise<Buffer> => {
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
        const response = (await httpClient.http('POST', delegatorUrl, {
            body: sponsorRequestBody
        })) as GetDelegationSignatureResult;

        return Buffer.from(response.signature.slice(2), 'hex');
    } catch (error) {
        throw new NotDelegatedTransaction(
            '_getDelegationSignature()',
            'Delegation failed: Cannot get signature from delegator.',
            {
                delegatorUrl
            },
            error
        );
    }
};

/**
 * Provide a set of utils for the delegation type.
 * It is a mutual exclusion between delegatorPrivateKey and delegatorUrl. (@see SignTransactionOptions)
 *
 * The aim of this handler is to:
 *   - Understand the kind of delegation and the delegation info
 *   - Provide a method to get the delegation signature
 *
 * @param delegator - The delegator options.
 */
const DelegationHandler = (
    delegator?: SignTransactionOptions | null
): {
    isDelegated: () => boolean;
    delegatorOrUndefined: () => SignTransactionOptions | undefined;
    delegatorOrNull: () => SignTransactionOptions | null;
    getDelegationSignatureUsingUrl: (
        tx: Transaction,
        originAddress: string,
        httpClient: IHttpClient
    ) => Promise<Buffer>;
} => {
    // Check if delegator is undefined (null or undefined)
    const delegatorIsUndefined = delegator === undefined || delegator === null;

    // Check if is delegated by url
    const isDelegatedWithUrl =
        !delegatorIsUndefined && delegator?.delegatorUrl !== undefined;

    // Check if is delegated by private key
    const isDelegatedWithPrivateKey =
        !delegatorIsUndefined && delegator?.delegatorPrivateKey !== undefined;

    return {
        /**
         * Check if the transaction is delegated.
         *
         * @returns true if the transaction is delegated, false otherwise.
         */
        isDelegated: (): boolean =>
            isDelegatedWithUrl || isDelegatedWithPrivateKey,

        /**
         * Get the delegator options or undefined.
         * (if delegator is undefined or null).
         *
         * @returns The delegator options or undefined.
         */
        delegatorOrUndefined: (): SignTransactionOptions | undefined =>
            delegatorIsUndefined ? undefined : delegator,

        /**
         * Get the delegator options or null.
         * (if delegator is undefined or null).
         *
         * @returns The delegator options or null.
         */
        delegatorOrNull: (): SignTransactionOptions | null =>
            delegatorIsUndefined ? null : delegator,

        /**
         * Retrieves the signature of a delegation transaction from a delegator given the endpoint
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
            httpClient: IHttpClient
        ): Promise<Buffer> => {
            // Cannot be delegated by private key
            if (!isDelegatedWithUrl) {
                throw new NotDelegatedTransaction(
                    'DelegationHandler.getDelegationSignatureUsingUrl()',
                    'Delegation with url failed: delegatorUrl is not defined.',
                    undefined
                );
            }

            return await _getDelegationSignature(
                tx,
                delegator?.delegatorUrl,
                originAddress,
                httpClient
            );
        }
    };
};

export { DelegationHandler };
