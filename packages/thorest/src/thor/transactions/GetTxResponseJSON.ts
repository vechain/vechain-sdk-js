import type { TxJSON, TxMetaJSON } from '@thor';

/**
 * [GetTxResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/GetTxResponse)
 */
interface GetTxResponseJSON extends TxJSON {
    meta: TxMetaJSON;
}

export { type GetTxResponseJSON };
