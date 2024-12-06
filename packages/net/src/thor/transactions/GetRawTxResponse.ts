import { HexUInt } from '@vechain/sdk-core';
import { TxMeta, type TxMetaJSON } from './TxMeta';

class GetRawTxResponse {
    readonly raw: HexUInt;
    readonly meta: TxMeta;

    constructor(json: GetRawTxResponseJSON) {
        this.raw = HexUInt.of(json.raw);
        this.meta = new TxMeta(json.meta);
    }

    toJSON(): GetRawTxResponseJSON {
        return {
            raw: this.raw.toString(),
            meta: this.meta.toJSON()
        } satisfies GetRawTxResponseJSON;
    }
}

interface GetRawTxResponseJSON {
    raw: string;
    meta: TxMetaJSON;
}

export { GetRawTxResponse, type GetRawTxResponseJSON };
