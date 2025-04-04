import { type ReceiptOutputJSON } from './ReceiptOutputJSON';

/**
 * [Receipt](http://localhost:8669/doc/stoplight-ui/#/schemas/Receipt)
 */
interface ReceiptJSON {
    type?: number; // int or null
    gasUsed: number; // int
    gasPayer: string; // address string
    paid: string; // hex string
    reward: string; // hex string
    reverted: boolean; // boolean
    outputs: ReceiptOutputJSON[];
}

export { type ReceiptJSON };
