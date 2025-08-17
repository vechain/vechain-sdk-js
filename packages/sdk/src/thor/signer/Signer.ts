import { type TransactionRequest } from '@thor';

interface Signer {
    sign: (transactionRequest: TransactionRequest) => Uint8Array;
}

export { type Signer };
