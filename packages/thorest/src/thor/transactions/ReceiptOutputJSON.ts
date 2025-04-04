import type { EventJSON } from './Event';
import type { TransferJSON } from './Transfer';

/**
 * [`Receipt.outputs` array property](http://localhost:8669/doc/stoplight-ui/#/schemas/Receipt)
 */
interface ReceiptOutputJSON {
    contractAddress: string; // address string
    events: EventJSON[];
    transfers: TransferJSON[];
}

export { type ReceiptOutputJSON };
