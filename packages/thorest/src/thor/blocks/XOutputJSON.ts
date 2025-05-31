import { type _EventJSON } from './_EventJSON';
import { type _TransferJSON } from './_TransferJSON';

/**
 *
 */
interface _OutputJSON {
    contractAddress: string | null; // hex address
    events: _EventJSON[];
    transfers: _TransferJSON[];
}

export { type _OutputJSON };
