import { type OutputJSON, type ReceiptMetaJSON } from '@thor/model';

/**
 * [GetTxReceiptResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/GetTxReceiptResponse)
 */
interface GetTxReceiptResponseJSON {
    type: number | null; // int
    gasUsed: string; // big int
    gasPayer: string; // address ^0x[0-9a-f]{40}$
    paid: string; // hex ^0x[0-9a-f]*$
    reward: string; // hex ^0x[0-9a-f]*$
    reverted: boolean;
    outputs: OutputJSON[];
    meta: ReceiptMetaJSON;
}

export { type GetTxReceiptResponseJSON };
