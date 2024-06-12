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
        blockID: string; // Block identifier associated with the entity
        blockNumber: number; // Block number associated with the entity
        blockTimestamp: number; // Timestamp of the block
        txID: string; // Transaction ID associated with the entity
        txOrigin: string; // Transaction origin information
        clauseIndex: number; // Index of the clause
    };
}

export { type Transfer };
