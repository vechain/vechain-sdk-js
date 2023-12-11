declare global {
    interface Window {
        vechain?: string;
    }
}

type BuiltinSigner = 'veworld' | 'sync2' | 'sync';

interface WalletOptions {
    node: string;
    network?: string;
    signer?: BuiltinSigner;
}

interface TransactionOptions {
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

interface CertificateOptions {
    signer?: string;
    link?: string;
    onAccepted?: () => void;
}

interface SignerDetail {
    TransactionOptions;
    CertificateOptions;
}

export type { BuiltinSigner, WalletOptions, SignerDetail };
