import type { TxMetaJSON } from '@thor';

/**
 * [ReceiptMeta](http://localhost:8669/doc/stoplight-ui/#/schemas/ReceiptMeta)
 */
interface ReceiptMetaJSON extends TxMetaJSON {
    txID: string;
    txOrigin: string;
}

export { type ReceiptMetaJSON };
