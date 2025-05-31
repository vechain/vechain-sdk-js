import { type XEventJSON } from '@thor/blocks/XEventJSON';
import { type XTransferJSON } from '@thor/blocks/XTransferJSON';

/**
 *
 */
interface XOutputJSON {
    contractAddress: string | null; // hex address
    events: XEventJSON[];
    transfers: XTransferJSON[];
}

export { type XOutputJSON };
