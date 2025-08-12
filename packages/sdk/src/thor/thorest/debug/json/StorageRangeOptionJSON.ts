/**
 * [StorageRangeOption](http://localhost:8669/doc/stoplight-ui/#/schemas/StorageRangeOption)
 */
interface StorageRangeOptionJSON {
    address: string; // hex address
    keyStart?: string; // hex 32 bytes
    maxResult?: number; // number or null
    target: string; // ^0x[0-9a-fA-F]{64}(\/(0x[0-9a-fA-F]{64}|\d+))?\/[0-9]+$
}

export { type StorageRangeOptionJSON };
