import type { TxMetaJSON } from '@thor/thorest/transactions/json';

/**
 * [GetRawTxResponse](http://localhost:8669/doc/stoplight-ui/#/paths/transactions-id/get)
 */
interface GetRawTxResponseJSON {
    raw: string;
    meta: TxMetaJSON;
}

export { type GetRawTxResponseJSON };
