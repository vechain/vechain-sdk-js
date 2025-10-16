import { type TxMetaJSON } from './TxMetaJSON';

/**
 * [RawTx](http://localhost:8669/doc/stoplight-ui/#/schemas/RawTx)
 */
interface RawTxJSON {
    raw: string; // hex string
    meta: TxMetaJSON;
}

export { type RawTxJSON };
