import { type Address } from '@vcdm';
import { type LogMeta } from './LogMeta';
import { type TransferLogResponse } from '@thor/logs/response';

/**
 * Individual transfer log
 */
class TransferLog {
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
     * Constructs a new TransferLog instance.
     *
     * @param response - The TransferLogResponse instance to convert.
     */
    constructor(response: TransferLogResponse) {
        this.sender = response.sender;
        this.recipient = response.recipient;
        this.amount = response.amount;
        this.meta = response.meta;
    }
}

export { TransferLog };
