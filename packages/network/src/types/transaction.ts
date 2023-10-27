import { type VMEvent, type VMTransfer } from './vm';

/** the transaction model */
interface Transaction {
    id: string;
    chainTag: number;
    blockRef: string;
    expiration: number;
    clauses: Array<{
        to: string | null;
        value: string;
        data: string;
    }>;
    gasPriceCoef: number;
    gas: number;
    origin: string;
    delegator?: string | null;
    nonce: string;
    dependsOn: string | null;
    size: number;
    meta: {
        blockID: string;
        blockNumber: number;
        blockTimestamp: number;
    };
}

/** the transaction visitor interface */
interface TransactionVisitor {
    /** the transaction id to be visited */
    readonly id: string;

    /** allow the queried tx be in pending state. a pending tx has null 'meta'. */
    allowPending: () => this;

    /** query the transaction */
    get: () => Promise<Transaction | null>;

    /** query the receipt */
    getReceipt: () => Promise<TransactionReceipt | null>;
}

/** the transaction receipt model */
interface TransactionReceipt {
    gasUsed: number;
    gasPayer: string;
    paid: string;
    reward: string;
    reverted: boolean;
    outputs: Array<{
        contractAddress: string | null;
        events: VMEvent[];
        transfers: VMTransfer[];
    }>;
    meta: {
        blockID: string;
        blockNumber: number;
        blockTimestamp: number;
        txID: string;
        txOrigin: string;
    };
}

export type { Transaction, TransactionVisitor, TransactionReceipt };
