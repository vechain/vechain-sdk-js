import { type Transaction } from '@vechain/vechain-sdk-core';
import { type HttpClient } from '../../../utils';
import { type GetDelegationSignatureResult } from '../types';
import { TRANSACTION, buildError } from '@vechain/vechain-sdk-errors';

/**
 * Retrieves the signature of a delegation transaction from a delegator given the endpoint
 * from which to retrieve the signature.
 *
 * @param tx - The transaction to delegate.
 * @param delegatorUrl - The URL of the endpoint of the delegator.
 * @param originAddress - The address of the origin account.
 * @param httpClient - The HTTP client instance used for making HTTP requests.
 *
 * @returns A promise that resolves to the signature of the delegation transaction.
 *
 * @see [Simple Gas Payer Standard](https://github.com/vechain/VIPs/blob/master/vips/VIP-201.md)
 *
 * @throws an error if the delegation fails.
 */
const getDelegationSignature = async (
    tx: Transaction,
    delegatorUrl: string,
    originAddress: string,
    httpClient: HttpClient
): Promise<Buffer> => {
    const rawTx = `0x${tx.encoded.toString('hex')}`;

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
        throw buildError(
            TRANSACTION.INVALID_DELEGATION,
            "Delegation failed: Can't get signature from delegator.",
            { delegatorUrl },
            error
        );
    }
};

export { getDelegationSignature };
