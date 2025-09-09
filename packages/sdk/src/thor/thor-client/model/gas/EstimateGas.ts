interface EstimateGas {
    provedWork?: string;
    gasPayer?: string;
    expiration?: number;
    blockRef?: string;
    clauses?: {
        to: string | null;
        value: string;
    }[];
    gas?: number;
    gasPrice?: string;
    caller?: string;
}

export type { EstimateGas };