import { type ClauseJSON } from '@thor/json';

/**
 * [ExecuteCodesRequest](http://localhost:8669/doc/stoplight-ui/#/schemas/ExecuteCodesRequest)
 */
interface ExecuteCodesRequestJSON {
    provedWork?: string;
    gasPayer?: string;
    expiration?: number;
    blockRef?: string;
    clauses?: ClauseJSON[];
    gas?: number;
    gasPrice?: string;
    caller?: string;
}

export { type ExecuteCodesRequestJSON };
