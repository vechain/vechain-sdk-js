/**
 * [Receipt](http://localhost:8669/doc/stoplight-ui/#/schemas/Receipt)
 */
import { type OutputJSON } from '@thor/thorest/json';

interface ReceiptJSON {
    type: number | null; // int
    gasUsed: number; // int
    gasPayer: string; // address ^0x[0-9a-f]{40}$
    paid: string; // hex ^0x[0-9a-f]*$
    reward: string; // hex ^0x[0-9a-f]*$
    reverted: boolean;
    outputs: OutputJSON[];
}

export { type ReceiptJSON };
