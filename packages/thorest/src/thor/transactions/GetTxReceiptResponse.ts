import { Receipt } from './Receipt';
import { ReceiptMeta, type ReceiptMetaJSON } from './ReceiptMeta';
import { type ReceiptJSON } from './ReceiptJSON';

class GetTxReceiptResponse extends Receipt {
    readonly meta: ReceiptMeta;

    constructor(json: GetTxReceiptResponseJSON) {
        super(json);
        this.meta = new ReceiptMeta(json.meta);
    }

    toJSON(): GetTxReceiptResponseJSON {
        return {
            ...super.toJSON(),
            meta: this.meta.toJSON()
        } satisfies GetTxReceiptResponseJSON;
    }
}

interface GetTxReceiptResponseJSON extends ReceiptJSON {
    meta: ReceiptMetaJSON;
}

export { GetTxReceiptResponse, type GetTxReceiptResponseJSON };
