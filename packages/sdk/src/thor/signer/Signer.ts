import { type SignedTransactionRequest, type TransactionRequest } from '@thor';
import { type Address } from '@vcdm';

interface Signer {
    address: Address;
    sign: (transactionRequest: TransactionRequest) => SignedTransactionRequest;
}

export { type Signer };
