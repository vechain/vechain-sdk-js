import {
    type VendorTxMessage,
    type VendorTxResponse,
    type VendorCertMessage,
    type VendorCertResponse
} from './vendor';

/**
 * The `Signer` interface defines the methods that need to be implemented by a wallet.
 * It serves as the driver for a vendor, exposing the interface for any wallet that implements a custom signer.
 */
interface Signer {
    /**
     * Signs a transaction message and returns the signed transaction response.
     * @param msg - The transaction message to sign.
     * @param options - Additional options for signing the transaction.
     * @returns A promise that resolves to the signed transaction response.
     */
    signTx: (
        msg: VendorTxMessage,
        options: SignerTxOptions
    ) => Promise<VendorTxResponse>;

    /**
     * Signs a certificate message and returns the signed certificate response.
     * @param msg - The certificate message to sign.
     * @param options - Additional options for signing the certificate.
     * @returns A promise that resolves to the signed certificate response.
     */
    signCert: (
        msg: VendorCertMessage,
        options: SignerCertOptions
    ) => Promise<VendorCertResponse>;
}

/**
 * Options for signing a transaction.
 */
interface SignerTxOptions {
    signer?: string; // The signer's address.
    gas?: number; // The gas limit for the transaction.
    dependsOn?: string; // The identifier of a dependent transaction.
    link?: string; // A related transaction link.
    comment?: string; // A comment or note for the transaction.
    delegator?: {
        url: string; // The delegator's URL.
        signer?: string; // The delegator's signer address.
    };
    onAccepted?: () => void; // Callback function when the transaction is accepted.
}

/**
 * Options for signing a certificate.
 */
interface SignerCertOptions {
    signer?: string; // The signer's address.
    link?: string; // A related certificate link.
    onAccepted?: () => void; // Callback function when the certificate is accepted.
}

/**
 * The `NewSigner` type represents a function that creates a signer with a specified genesis ID.
 */
type NewSigner = (genesisId: string) => Promise<Signer>;

export type { Signer, SignerTxOptions, SignerCertOptions, NewSigner };
