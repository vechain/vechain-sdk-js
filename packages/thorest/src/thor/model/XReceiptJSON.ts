import { type ClauseJSON } from '@thor/model/ClauseJSON';
import { type XOutputJSON } from '@thor/model/XOutputJSON';

/**
 * [Receipt](http://localhost:8669/doc/stoplight-ui/#/schemas/Receipt)
 */

interface XReceiptJSON {
    id: string; // tx id
    type?: number | null; // int
    origin: string; // hex address;
    delegator?: string | null; // hex address null;
    size: number; // int
    chainTag: number; // int
    blockRef: string; // hex
    expiration: number; // int
    clauses: ClauseJSON[];
    gasPriceCoef?: number | null; // int or null
    maxFeePerGas?: string | null; // her or null
    maxPriorityFeePerGas?: string | null; // hex or null
    gas: number; // int
    dependsOn?: string | null; // hex
    nonce: string; // hex
    gasUsed: number; // int
    gasPayer: string; // hex address
    paid: string; // hex
    reward: string; // hex;
    reverted: boolean;
    outputs: XOutputJSON[];
}

export { type XReceiptJSON };
