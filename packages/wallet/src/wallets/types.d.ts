import { type SignTransactionOptions } from '@vechain/sdk-network';
import { type TransactionClause } from '@vechain/sdk-core';

/**
 * Represent a single account in a wallet.
 * Basically an account is a triple of **address**, **private key** and **public key**.
 */
interface WalletAccount {
    /**
     * Address of the account.
     */
    address: string;

    /**
     * Private key of the account.
     */
    privateKey: Buffer;

    /**
     * Public key of the account.
     */
    publicKey: Buffer;
}

interface WalletInterface {
    sendTransaction: (
        clauses: ExtendedClause[],
        options?: SendTxOptions
    ) => Promise<SendTxResponse>;

    signCertificate: (
        request: CertificateRequest,
        options?: CertificateOptions
    ) => Promise<CertificateResponse>;
}
/**
 * Represent a wallet.
 * Basically a wallet is a list of {@link WalletAccount}.
 *
 * @note To be compatible with vechain-sdk-wallet stack it is better
 * to implement this interface for each kind of wallet you want to use.
 *
 * Basically, this interface contains all data needed for a wallet that others can use.
 * e.g., Provider can use this interface to get the list of accounts in a wallet.
 */
interface Wallet {
    /**
     * Options for signing a transaction with delegator.
     */
    delegator?: SignTransactionOptions;

    /**
     * List of accounts in the wallet.
     */
    accounts: WalletAccount[];

    /**
     * Get the list of addresses in the wallet.
     *
     * @returns The list of addresses in the wallet.
     */
    getAddresses: () => Promise<string[]>;

    /**
     * Get an account by address.
     *
     * @param address - Address of the account.
     * @returns The account with the given address, or null if not found.
     */
    getAccount: (address: string) => Promise<WalletAccount | null>;

    /**
     * Get the options for signing a transaction with delegator (if any).
     *
     * @returns The options for signing a transaction with delegator.
     */
    getDelegator: () => Promise<SignTransactionOptions | null>;
}

/**
 * Defines the extended clause for sending a transaction.
 * @property comment - The comment for the transaction clause.
 * @property abi - The ABI for the transaction clause.
 */
type ExtendedClause = TransactionClause & {
    comment?: string;
    abi?: object;
};

/**
 * Defines the options for sending a transaction.
 * @property signer - Request an account to send the transaction.
 * @property gas - The gas limit for the transaction.
 * @property dependsOn - The transaction hash that this transaction depends on.
 * @property link - The callback URL for the transaction.
 * @property comment - The comment for the transaction.
 * @property delegator - The delegator for the transaction.
 * @property onAccepted - The callback function that is called when the transaction is sent to the wallet.
 */
interface SendTxOptions {
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

/**
 * Defines the response for sending a transaction.
 * @property id - The transaction ID.
 * @property signer - The signer for the transaction.
 */
interface SendTxResponse {
    readonly id: string;
    readonly signer: string;
}

/**
 *
 */
interface CertificateRequest {
    purpose: 'identification' | 'agreement';
    payload: {
        type: 'text';
        content: string;
    };
}

interface CertificateResponse {
    annex: {
        domain: string;
        timestamp: number;
        signer: string;
    };
    signature: string;
}

interface CertificateOptions {
    signer?: string;
    link?: string;
    onAccepted?: () => void;
}

type AddWalletFn = (client: ThorClient) => BaseSigner;

export type {
    Wallet,
    WalletInterface,
    WalletAccount,
    AddWalletFn,
    ExtendedClause,
    SendTxOptions,
    SendTxResponse,
    CertificateRequest,
    CertificateOptions,
    CertificateResponse
};
