import { type EventJSON, type TransferJSON } from '@thor/json';

/**
 *
 */
interface OutputJSON {
    contractAddress: string | null; // hex address
    events: EventJSON[];
    transfers: TransferJSON[];
}

export { type OutputJSON };
