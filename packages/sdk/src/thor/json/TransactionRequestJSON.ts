import { type ClauseJSON } from '@thor/json/ClauseJSON';

interface TransactionRequestJSON {
    blockRef: string;
    chainTag: number;
    clauses: ClauseJSON[];
    dependsOn: string | null;
    expiration: number;
    gas: bigint;
    gasPriceCoef: bigint;
    nonce: number;
}

export type { TransactionRequestJSON };
