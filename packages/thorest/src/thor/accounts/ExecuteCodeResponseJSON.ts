import { type EventJSON, type TransferJSON } from '@thor';

/**
 * Execute Code Response JSON
 *
 * JSON representation of a single code execution response.
 */
interface ExecuteCodeResponseJSON {
    /**
     * The response data.
     */
    data: string;

    /**
     * The events generated during execution.
     */
    events: EventJSON[];

    /**
     * The transfers generated during execution.
     */
    transfers: TransferJSON[];

    /**
     * The amount of gas used.
     */
    gasUsed: number;

    /**
     * Whether the execution was reverted.
     */
    reverted: boolean;

    /**
     * The VM error message
     */
    vmError: string;
}

export { type ExecuteCodeResponseJSON };
