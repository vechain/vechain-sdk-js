import { type ClauseJSON } from '@thor/json';

interface TransactionRequestJSON {
    blockRef: string;
    chatTag: number;
    clauses: ClauseJSON[];
    dependsOn?: string;
    features?: number;
    expiration: number;
    gas: bigint;
    gasPrice: bigint;
    gasPriceCoef: bigint;
    nonce: number;
    reserved?: Uint8Array[];
}

export type { TransactionRequestJSON };
