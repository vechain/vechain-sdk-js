import { type EventJSON } from '@thor/model/EventJSON';
import { type XTransferJSON } from '@thor/model/XTransferJSON';

/**
 *
 */
interface OutputJSON {
    contractAddress: string | null; // hex address
    events: EventJSON[];
    transfers: XTransferJSON[];
}

export { type OutputJSON };
