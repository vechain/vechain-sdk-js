import { Address, HexUInt, Quantity } from '@vcdm';
import { LogMeta, type TransferLogResponseJSON } from '@thor';
import { IllegalArgumentError } from '@errors';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/sdk/src/thor/logs/TransferLogResponse.ts!';

/**
 * [TransferLogResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/TransferLogsResponse)
 */
class TransferLogResponse {
    /**
     * The address that sent the VET.
     */
    readonly sender: Address;

    /**
     * The address that received the VET.
     */
    readonly recipient: Address;

    /**
     * The amount of VET transferred.
     */
    readonly amount: bigint;

    /**
     * The event or transfer log metadata such as block number, block timestamp, etc.
     */
    readonly meta: LogMeta;

    /**
     * Constructs an instance of the trasfer logs response as a JSON object.
     *
     * @param {TransferLogResponseJSON} json - The JSON object containing filter options.
     * Each property in the JSON object is parsed and converted to its respective type.
     * @throws {IllegalArgumentError} If the provided JSON object contains invalid or unparsable data.
     */
    constructor(json: TransferLogResponseJSON) {
        try {
            this.sender = Address.of(json.sender);
            this.recipient = Address.of(json.recipient);
            this.meta = new LogMeta(json.meta);
            this.amount = HexUInt.of(json.amount).bi;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: TransferLogResponseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current TransferLogFilterRequestJSON instance into a JSON representation.
     *
     * @return {TransferLogResponseJSON} The JSON object representing the current FilterOptions instance.
     */
    toJSON(): TransferLogResponseJSON {
        return {
            sender: this.sender.toString(),
            recipient: this.recipient.toString(),
            amount: Quantity.of(this.amount).toString(),
            meta: this.meta.toJSON()
        } satisfies TransferLogResponseJSON;
    }
}

export { TransferLogResponse };
