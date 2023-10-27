import {
    type VendorTxMessage,
    type VendorTxResponse,
    type VendorCertMessage,
    type VendorCertResponse
} from './vendor';

/**
 * signer defines the interfaces needs be to implemented of a wallet.
 * it is the driver of vendor, exposing the interface for any possible
 * wallet implementing a custom signer
 */
interface Signer {
    signTx: (
        msg: VendorTxMessage,
        options: SignerTxOptions
    ) => Promise<VendorTxResponse>;
    signCert: (
        msg: VendorCertMessage,
        options: SignerCertOptions
    ) => Promise<VendorCertResponse>;
}

interface SignerTxOptions {
    signer?: string;
    gas?: number;
    dependsOn?: string;
    link?: string;
    comment?: string;
    delegator?: {
        url: string;
        signer?: string;
    };
    onAccepted?: () => void;
}
interface SignerCertOptions {
    signer?: string;
    link?: string;
    onAccepted?: () => void;
}

// NewSigner creates a singer with genesis id.
type NewSigner = (genesisId: string) => Promise<Signer>;

export type { Signer, SignerTxOptions, SignerCertOptions, NewSigner };
