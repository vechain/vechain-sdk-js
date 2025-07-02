import { type EventJSON } from '@thor/model/EventJSON';
import { type TransferJSON } from '@thor/model/TransferJSON';

/**
 *
 */
interface OutputJSON {
    contractAddress: string | null; // hex address
    events: EventJSON[];
    transfers: TransferJSON[];
}

export { type OutputJSON };
