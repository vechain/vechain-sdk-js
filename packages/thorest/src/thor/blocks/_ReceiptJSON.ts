import { type _ClauseJSON } from './_ClauseJSON';
import { type _OutputJSON } from './_OutputJSON';

/**
 * [Receipt](http://localhost:8669/doc/stoplight-ui/#/schemas/Receipt)
 */
// eslint-disable-next-line sonarjs/class-name
interface _ReceiptJSON {
    id: string; // tx id
    type?: number | null; // int
    origin: string; // hex address;
    delegator?: string | null; // hex address null;
    size: number; // int
    chainTag: number; // int
    blockRef: string; // hex
    expiration: number; // int
    clauses: _ClauseJSON[];
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
    outputs: _OutputJSON[];
}

export { type _ReceiptJSON };
