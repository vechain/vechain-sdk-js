// Local type declarations for @vechain/sdk-thorest-api
// This allows TypeScript compilation in CI where peer dependencies aren't installed

declare module '@vechain/sdk/thor' {
    export interface RegularBlockResponse {
        id: string;
        number: number;
        size: number;
        parentID: string;
        timestamp: number;
        gasLimit: number;
        gasUsed: number;
        totalScore: number;
        txsRoot: string;
        txsFeatures: number;
        stateRoot: string;
        receiptsRoot: string;
        signer: string;
        transactions: string[];
        [key: string]: any;
    }

    // Transaction types
    export interface TransactionClause {
        to: string | null;
        value: string;
        data: string;
    }

    export interface TransactionBody {
        chainTag: number;
        blockRef: string;
        expiration: number;
        clauses: TransactionClause[];
        gas: number;
        gasPriceCoef: number;
        dependsOn: string | null;
        nonce: number | string;
        reserved?: any;
    }

    // Core classes
    export class Address {
        static of(address: string): Address;
        static ofPublicKey(publicKey: Uint8Array): Address;
        toString(): string;
    }

    export class ClauseBuilder {
        static transferVET(to: Address, amount: bigint): TransactionClause;
        static transferToken(tokenAddress: Address, to: Address, amount: bigint): TransactionClause;
    }

    export class FetchHttpClient {
        static at(url: URL, options: any): FetchHttpClient;
    }

    export class HexUInt {
        static of(value: string): HexUInt;
        readonly bytes: Uint8Array;
    }

    export class Revision {
        static of(revision: string | number): Revision;
    }

    export class Transaction {
        static of(body: TransactionBody): Transaction;
        sign(privateKey: Uint8Array): Transaction;
        readonly encoded: Uint8Array;
    }

    export class RetrieveExpandedBlock {
        static of(revision: Revision): RetrieveExpandedBlock;
        askTo(client: FetchHttpClient): Promise<{ response: any }>;
    }

    export class RetrieveRegularBlock {
        static of(revision: Revision): RetrieveRegularBlock;
        askTo(client: FetchHttpClient): Promise<{ response: RegularBlockResponse | null }>;
    }

    export class SendTransaction {
        static of(encodedTx: Uint8Array): SendTransaction;
        askTo(client: FetchHttpClient): Promise<{ response: { id: any } }>;
    }

    export class HDKey {
        static readonly VET_DERIVATION_PATH: string;
        static fromMnemonic(words: string[], path?: string, passphrase?: string): HDKey;
        deriveChild(index: number): HDKey;
        readonly privateKey: Uint8Array | null;
        readonly publicKey: Uint8Array | null;
    }

    // Constants and enums
    export const ThorNetworks: {
        SOLONET: string;
        MAINNET: string;
        TESTNET: string;
    };

    export const VTHO_ADDRESS: string;
}
