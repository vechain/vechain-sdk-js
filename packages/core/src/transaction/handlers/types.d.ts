import { type TransactionBody } from '../types';

interface TransactionToSign {
    body: TransactionBody;
    signature?: Buffer | undefined;
}

export type { TransactionToSign };
