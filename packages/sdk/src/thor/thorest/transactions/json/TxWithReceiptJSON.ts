import { type OutputJSON, type TxJSON } from '@thor/thorest/json';

/**
 * Type of the property
 * [ExpandedBlockResponse.transactions](http://localhost:8669/doc/stoplight-ui/#/schemas/ExpandedBlockResponse)
 * combines
 * [Tx](http://localhost:8669/doc/stoplight-ui/#/schemas/Tx)
 * and
 * [Receipt](http://localhost:8669/doc/stoplight-ui/#/schemas/Receipt)
 */
interface TxWithReceiptJSON extends TxJSON {
    type: number | null; // int
    gasUsed: number; // int
    gasPayer: string; // address ^0x[0-9a-f]{40}$
    paid: string; // hex ^0x[0-9a-f]*$
    reward: string; // hex ^0x[0-9a-f]*$
    reverted: boolean;
    outputs: OutputJSON[];
}

export { type TxWithReceiptJSON };
