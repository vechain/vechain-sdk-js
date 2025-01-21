import { LogMeta, type LogMetaJSON } from './LogMeta';
import { Address, HexUInt, Units, VET } from '@vechain/sdk-core';

class TransferLogResponse {
    readonly sender: Address;
    readonly recipient: Address;
    readonly amount: VET;
    readonly meta: LogMeta;

    constructor(json: TransferLogResponseJSON) {
        this.sender = Address.of(json.sender);
        this.recipient = Address.of(json.recipient);
        this.amount = VET.of(HexUInt.of(json.amount).bi, Units.wei);
        this.meta = new LogMeta(json.meta);
    }

    toJSON(): TransferLogResponseJSON {
        return {
            sender: this.sender.toString(),
            recipient: this.recipient.toString(),
            amount: HexUInt.of(this.amount.wei).toString(),
            meta: this.meta.toJSON()
        } satisfies TransferLogResponseJSON;
    }
}

interface TransferLogResponseJSON {
    sender: string;
    recipient: string;
    amount: string;
    meta: LogMetaJSON;
}

interface TransferLogsResponse extends Array<TransferLogResponse> {}

interface TransferLogsResponseJSON extends Array<TransferLogResponseJSON> {}

export {
    TransferLogResponse,
    type TransferLogResponseJSON,
    type TransferLogsResponse,
    type TransferLogsResponseJSON
};
