interface Clause {
    /**
     * The recipient of the clause. Null indicates contract deployment.
     */
    to: string | null; // hex address

    /**
     * The hexadecimal representation of the amount (wei) of VET to be transferred.
     *
     * Thor expresses the amount as a hexadecimal {@link Quantity} expression,
     * aligned to nibble (4 bits); for example, zero is expressed as `0x0`.
     *
     */
    value: string; // hex ^0x[0-9a-f]*$

    /**
     * The input data for the clause (in bytes).
     */
    data?: string; // hex ^0x[0-9a-f]*$
}

interface EstimateGasRequest {
    provedWork?: string;
    gasPayer?: string;
    expiration?: number;
    blockRef?: string;
    clauses?: Clause[];
    gas?: number;
    gasPrice?: string;
    caller?: string;
}

export type { EstimateGasRequest };