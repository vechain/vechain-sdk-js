import { TxMeta, type TxMetaJSON } from './TxMeta';
import { Address, TxId } from '@vechain/sdk-core';

class ReceiptMeta extends TxMeta {
    txID: TxId;
    txOrigin: Address;

    constructor(json: ReceiptMetaJSON) {
        super(json);
        this.txID = TxId.of(json.txID);
        this.txOrigin = Address.of(json.txOrigin);
    }

    toJSON(): ReceiptMetaJSON {
        return {
            ...super.toJSON(),
            txID: this.txID.toString(),
            txOrigin: this.txOrigin.toString()
        } satisfies ReceiptMetaJSON;
    }
}

interface ReceiptMetaJSON extends TxMetaJSON {
    txID: string;
    txOrigin: string;
}

export { ReceiptMeta, type ReceiptMetaJSON };
