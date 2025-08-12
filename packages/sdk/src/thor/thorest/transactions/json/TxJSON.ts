import { type ClauseJSON } from '@thor/thorest/json';

/**
 * [Tx](http://localhost:8669/doc/stoplight-ui/#/schemas/Tx)
 */
interface TxJSON {
    id: string; // hex ^0x[0-9a-f]{64}$
    type: number | null; // int
    origin: string; // address ^0x[0-9a-f]{40}$
    delegator: string | null; // address ^0x[0-9a-f]{40}$
    size: number; // int
    chainTag: number; // int
    blockRef: string; // hex ^0x[0-9a-f]{64}$
    expiration: number; // int
    clauses: ClauseJSON[]; // Clause[]
    gasPriceCoef: string | null; // int
    maxFeePerGas: string | null; // hex
    maxPriorityFeePerGas: string | null; // hex
    gas: string; // int
    dependsOn: string | null; // hex ^0x[0-9a-f]{64}$
    nonce: string; // hex int
}

export { type TxJSON };
