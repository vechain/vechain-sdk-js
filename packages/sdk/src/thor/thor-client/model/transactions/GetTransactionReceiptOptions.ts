import { type Hex } from '@common/vcdm';

/**
 * Options for the `getTransactionReceipt` method.
 */
interface GetTransactionReceiptOptions {
    /**
     * (Optional) The block ID of the state to reference for the receipt.
     * If not provided, the receipt will be returned for the latest block.
     */
    head?: Hex;
}

export { type GetTransactionReceiptOptions };
