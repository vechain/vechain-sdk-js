import { type Hex } from '@common/vcdm';
import { type Transfer, type Event } from '@thor/thor-client/model';
import { type ExecuteCodeResponse } from '@thor/thorest';

/**
 * The result of a simulation of a clause
 */
class ClauseSimulationResult {
    /**
     * Data returned from the transaction simulation
     */
    data: Hex;
    /**
     * Events emitted from the transaction simulation
     */
    events: Event[];
    /**
     * Transfers that occur from the transaction simulation
     */
    transfers: Transfer[];
    /**
     * Gas used from the transaction simulation
     */
    gasUsed: bigint;
    /**
     * Boolean indicating if the transaction simulation reverted
     */
    reverted: boolean;
    /**
     * Error message from the transaction simulation if it reverted
     */
    vmError: string;

    /**
     * Create a clause simulation result from the given execute code response.
     *
     * @param resp - The execute code response to create the clause simulation result from.
     * @returns The clause simulation result.
     */
    constructor(resp: ExecuteCodeResponse) {
        this.data = resp.data;
        this.events = resp.events;
        this.transfers = resp.transfers;
        this.gasUsed = resp.gasUsed;
        this.reverted = resp.reverted;
        this.vmError = resp.vmError;
    }
}

export { ClauseSimulationResult };
