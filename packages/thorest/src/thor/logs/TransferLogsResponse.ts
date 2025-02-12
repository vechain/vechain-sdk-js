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
        this.meta = new LogMeta(json.meta);
        try {
            this.amount = VET.of(HexUInt.of(json.amount).bi, Units.wei);
        } catch (error) {
            throw new Error(
                `Invalid TransferLogResponseJSON ${json.amount} and ${typeof json.amount} `
            );
        }
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

class TransferLogsResponse extends Array<TransferLogResponse> {
    /**
     * Creates a new TransferLogsResponse instance.
     * Special constructor pattern required for Array inheritance.
     * Array constructor is first called with a length parameter,
     * so we need this pattern to properly handle array data instead.
     *
     * @param json - The JSON array containing transfer log data
     * @returns A new TransferLogsResponse instance containing TransferLogResponse objects
     */
    constructor(json: TransferLogsResponseJSON) {
        super();
        return Object.setPrototypeOf(
            Array.from(json ?? [], (peerStat) => {
                return new TransferLogResponse(peerStat);
            }),
            TransferLogsResponse.prototype
        ) as TransferLogsResponse;
    }

    /**
     * Converts the TransferLogsResponse instance to a JSON array
     * @returns {TransferLogsResponseJSON} An array of transfer logs in JSON format
     */
    toJSON(): TransferLogsResponseJSON {
        return this.map((response): TransferLogResponseJSON => {
            const res = new TransferLogResponse(
                response as unknown as TransferLogResponseJSON
            );
            return res.toJSON();
        });
    }
}

interface TransferLogsResponseJSON extends Array<TransferLogResponseJSON> {}

export {
    TransferLogResponse,
    type TransferLogResponseJSON,
    TransferLogsResponse,
    type TransferLogsResponseJSON
};
