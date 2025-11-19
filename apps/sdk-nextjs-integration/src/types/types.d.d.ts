/**
 * Transfer interface definition.
 * It is used to represent an element
 * of the transfer history
 */
interface Transfer {
    from: string;
    to: string;
    amount: string;
    meta: {
        blockID: string;
        blockNumber: number;
        blockTimestamp: number;
        txID: string;
        txOrigin: string;
        clauseIndex: number;
    };
}
/**
 * Hashed content example type.
 */
interface HashedContent {
    blake2b256: string;
    keccak256: string;
    sha256: string;
}
export { type Transfer, type HashedContent };
//# sourceMappingURL=types.d.d.ts.map