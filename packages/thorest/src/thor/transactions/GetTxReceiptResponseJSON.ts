import type { ReceiptJSON, ReceiptMetaJSON } from '@thor';

/**
 * [GetTxReceiptResponse](http://localhost:8669/doc/stoplight-ui/#/paths/transactions-id/get)
 */
interface GetTxReceiptResponseJSON extends ReceiptJSON {
    meta: ReceiptMetaJSON;
}

export { type GetTxReceiptResponseJSON };
