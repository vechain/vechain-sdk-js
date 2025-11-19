"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegationHandler = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const http_1 = require("../../../http");
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
const _getDelegationSignature = async (tx, gasPayerServiceUrl, originAddress, httpClient) => {
    const rawTx = sdk_core_1.Hex.of(tx.encoded).toString();
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
        const response = (await httpClient.http(http_1.HttpMethod.POST, gasPayerServiceUrl, {
            body: sponsorRequestBody,
            headers: { 'Content-Type': 'application/json' }
        }));
        return sdk_core_1.HexUInt.of(response.signature.slice(2)).bytes;
    }
    catch (error) {
        throw new sdk_errors_1.NotDelegatedTransaction('_getDelegationSignature()', 'Delegation failed: Cannot get signature from gasPayerUrl.', {
            gasPayerUrl: gasPayerServiceUrl
        }, error);
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
const DelegationHandler = (gasPayer) => {
    // Check if gasPayer is undefined (null or undefined)
    const gasPayerIsUndefined = gasPayer === undefined || gasPayer === null;
    // Check if is delegated by url
    const isDelegatedWithUrl = !gasPayerIsUndefined && gasPayer?.gasPayerServiceUrl !== undefined;
    // Check if is delegated by private key
    const isDelegatedWithPrivateKey = !gasPayerIsUndefined && gasPayer?.gasPayerPrivateKey !== undefined;
    return {
        /**
         * Check if the transaction is delegated.
         *
         * @returns true if the transaction is delegated, false otherwise.
         */
        isDelegated: () => isDelegatedWithUrl || isDelegatedWithPrivateKey,
        /**
         * Get the gasPayer options or undefined.
         * (if gasPayer is undefined or null).
         *
         * @returns The gasPayer options or undefined.
         */
        gasPayerOrUndefined: () => gasPayerIsUndefined ? undefined : gasPayer,
        /**
         * Get the gasPayer options or null.
         * (if gasPayer is undefined or null).
         *
         * @returns The gasPayer options or null.
         */
        gasPayerOrNull: () => gasPayerIsUndefined ? null : gasPayer,
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
        getDelegationSignatureUsingUrl: async (tx, originAddress, httpClient) => {
            // Cannot be delegated by private key
            if (!isDelegatedWithUrl) {
                throw new sdk_errors_1.NotDelegatedTransaction('DelegationHandler.getDelegationSignatureUsingUrl()', 'Delegation with url failed: gasPayerServiceUrl is not defined.', undefined);
            }
            return await _getDelegationSignature(tx, gasPayer?.gasPayerServiceUrl, originAddress, httpClient);
        }
    };
};
exports.DelegationHandler = DelegationHandler;
