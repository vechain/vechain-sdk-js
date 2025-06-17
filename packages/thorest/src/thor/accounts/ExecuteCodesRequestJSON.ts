import { type ClauseJSON } from '@thor';

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