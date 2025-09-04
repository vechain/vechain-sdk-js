import type { TxJSON, TxMetaJSON } from '@thor/thorest/json';

/**
 * [GetTxResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/GetTxResponse)
 */
interface GetTxResponseJSON extends TxJSON {
    meta: TxMetaJSON;
}

export { type GetTxResponseJSON };
