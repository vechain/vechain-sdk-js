import { sign, signWithDelegator, decode } from './handlers';

const TransactionHandler = {
    // Sign transaction
    sign,
    signWithDelegator,

    // Decode transaction
    decode
};
export { TransactionHandler };
