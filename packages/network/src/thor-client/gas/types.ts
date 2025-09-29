/**
 * Gas estimation options
 */
export interface EstimateGasOptions {
    revision?: string | number;
    gas?: number;
    gasPrice?: string;
    provedWork?: string;
    gasPayer?: string;
    expiration?: number;
    blockRef?: string;
}
