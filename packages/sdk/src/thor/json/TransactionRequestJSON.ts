import { type TransactionClause } from '@thor';

interface TransactionRequestJSON {
    blockRef: string;
    chainTag: number;
    clauses: TransactionClause[];
    dependsOn: string | null;
    expiration: number;
    gas: number;
    gasPriceCoef: number;
    nonce: number;
}

export type { TransactionRequestJSON };
