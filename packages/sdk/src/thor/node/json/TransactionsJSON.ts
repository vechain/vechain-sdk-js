import { type TxJSON } from '@thor/json';

/**
 * [Transactions](http://localhost:8669/doc/stoplight-ui/#/schemas/Transactions)
 */
interface TransactionsJSON extends Array<TxJSON> {}

export { type TransactionsJSON };
