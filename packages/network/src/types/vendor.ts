import { type VMClause } from './vm';

/**
 * The `Vendor` interface provides a way to interact with wallets for transaction and certificate signing.
 */
interface Vendor {
    /**
     * Create a transaction signing service.
     * @param kind - The kind of signing service ('tx').
     * @param msg - The transaction message to sign.
     * @returns A VendorTxSigningService for signing transactions.
     */
    sign: ((kind: 'tx', msg: VendorTxMessage) => VendorTxSigningService) &
        ((kind: 'cert', msg: VendorCertMessage) => VendorCertSigningService);
}

/**
 * The interface for requesting a user's wallet to sign transactions.
 */
interface VendorTxSigningService {
    /**
     * Designate the signer's address.
     * @param addr - The signer's address.
     * @returns The updated VendorTxSigningService object.
     */
    signer: (addr: string) => this;

    /**
     * Set the maximum allowed gas for the transaction.
     * @param gas - The gas limit.
     * @returns The updated VendorTxSigningService object.
     */
    gas: (gas: number) => this;

    /**
     * Set another transaction ID as a dependency.
     * @param txid - The transaction ID to depend on.
     * @returns The updated VendorTxSigningService object.
     */
    dependsOn: (txid: string) => this;

    /**
     * Provides the URL of a web page to reveal transaction-related information.
     * The first appearance of the slice '{txid}' in the given link URL will be replaced with the transaction ID.
     * @param url - The URL of the web page.
     * @returns The updated VendorTxSigningService object.
     */
    link: (url: string) => this;

    /**
     * Set a comment for the transaction content.
     * @param text - The comment text.
     * @returns The updated VendorTxSigningService object.
     */
    comment: (text: string) => this;

    /**
     * Enable VIP-191 by providing the URL of a web API that offers delegation service.
     * @param url - The URL of the web API.
     * @param signer - A hint of the delegator address.
     * @returns The updated VendorTxSigningService object.
     */
    delegate: (url: string, signer?: string) => this;

    /**
     * Register a callback function fired when the request is accepted by the user's wallet.
     * @param cb - The callback function.
     * @returns The updated VendorTxSigningService object.
     */
    accepted: (cb: () => void) => this;

    /**
     * Send the request to the user's wallet.
     * @returns A promise that resolves to the VendorTxResponse.
     */
    request: () => Promise<VendorTxResponse>;
}

/**
 * The interface for requesting a user's wallet to sign certificates.
 */
interface VendorCertSigningService {
    /**
     * Designate the signer's address.
     * @param addr - The signer's address.
     * @returns The updated VendorCertSigningService object.
     */
    signer: (addr: string) => this;

    /**
     * Provides the URL of a web page to reveal certificate-related information.
     * The first appearance of the slice '{certid}' in the given link URL will be replaced with the certificate ID.
     * @param url - The URL of the web page.
     * @returns The updated VendorCertSigningService object.
     */
    link: (url: string) => this;

    /**
     * Register a callback function fired when the request is accepted by the user's wallet.
     * @param cb - The callback function.
     * @returns The updated VendorCertSigningService object.
     */
    accepted: (cb: () => void) => this;

    /**
     * Send the request to the user's wallet.
     * @returns A promise that resolves to the VendorCertResponse.
     */
    request: () => Promise<VendorCertResponse>;
}

/**
 * Represents a message for transaction signing.
 */
type VendorTxMessage = Array<
    VMClause & {
        comment?: string; // Comment for the clause.
        abi?: object; // ABI hint for wallet to decode clause data.
    }
>;

/**
 * Represents a message for certificate signing.
 */
interface VendorCertMessage {
    purpose: 'identification' | 'agreement'; // The purpose of the certificate.
    payload: {
        type: 'text'; // The type of payload.
        content: string; // The content of the certificate.
    };
}

/**
 * Represents the response for a transaction signing request.
 */
interface VendorTxResponse {
    txid: string; // Transaction ID.
    signer: string; // Signer's address.
}

/**
 * Represents the response for a certificate signing request.
 */
interface VendorCertResponse {
    annex: {
        domain: string; // Domain of the certificate.
        timestamp: number; // Timestamp of the certificate.
        signer: string; // Signer's address.
    };
    signature: string; // Certificate signature.
}

export type {
    Vendor,
    VendorTxMessage,
    VendorCertMessage,
    VendorTxResponse,
    VendorCertResponse,
    VendorCertSigningService,
    VendorTxSigningService
};
