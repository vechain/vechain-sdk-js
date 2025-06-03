import { type XEventJSON } from '@thor/model/XEventJSON';
import { type XTransferJSON } from '@thor/model/XTransferJSON';

/**
 *
 */
interface XOutputJSON {
    contractAddress: string | null; // hex address
    events: XEventJSON[];
    transfers: XTransferJSON[];
}

export { type XOutputJSON };
