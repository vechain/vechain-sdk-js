import { type Hex } from '@common/vcdm';

/**
 * Options for retrieving a transaction.
 */
interface GetTransactionOptions {
    pending?: boolean;
    head?: Hex;
}

export { type GetTransactionOptions };
