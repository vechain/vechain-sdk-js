import { type Hex } from '@common/vcdm';
import { Event, Transfer } from '@thor/thor-client/model';
import { type ExecuteCodeResponse } from '@thor/thorest';

/**
 * The result of a simulation of a clause
 */
class ClauseSimulationResult {
    /**
     * Data returned from the transaction simulation
     */
    readonly data: Hex;
    /**
     * Events emitted from the transaction simulation
     */
    readonly events: Event[];
    /**
     * Transfers that occur from the transaction simulation
     */
    readonly transfers: Transfer[];
    /**
     * Gas used from the transaction simulation
     */
    readonly gasUsed: bigint;
    /**
     * Boolean indicating if the transaction simulation reverted
     */
    readonly reverted: boolean;
    /**
     * Error message from the transaction simulation if it reverted
     */
    readonly vmError: string;

    /**
     * Create a clause simulation result from the given execute code response.
     *
     * @param resp - The execute code response to create the clause simulation result from.
     * @returns The clause simulation result.
     */
    constructor(resp: ExecuteCodeResponse) {
        this.data = resp.data;
        this.events = resp.events.map((event) => Event.of(event));
        this.transfers = resp.transfers.map((transfer) =>
            Transfer.of(transfer)
        );
        this.gasUsed = resp.gasUsed;
        this.reverted = resp.reverted;
        this.vmError = resp.vmError;
    }
}

export { ClauseSimulationResult };
