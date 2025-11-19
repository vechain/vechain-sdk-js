/**
 * Represents the type of a transaction
 */
export declare enum TransactionType {
    Legacy = "legacy",
    EIP1559 = "eip1559"
}
/**
 * Converts a transaction type number to TransactionType string.
 * Type 0 represents legacy transactions, type 81 (0x51) represents EIP-1559 transactions
 *
 * @param type - The transaction type number (0 or 81)
 * @returns The transaction type as 'legacy' or 'eip1559'
 * @throws {Error} If the input type is not a valid transaction type
 * @example
 * ```typescript
 * const type = toTransactionType(81); // returns TransactionType.EIP1559
 * const type = toTransactionType(0);  // returns TransactionType.Legacy
 * ```
 */
export declare function toTransactionType(type: number): TransactionType;
/**
 * Converts a TransactionType string to its corresponding number representation.
 * 'legacy' transactions are type 0, 'eip1559' transactions are type 81 (0x51).
 *
 * @param type - The transaction type as TransactionType
 * @returns The transaction type number (0 for legacy, 81 for eip1559)
 * @example
 * ```typescript
 * const type = fromTransactionType(TransactionType.EIP1559); // returns 81
 * const type = fromTransactionType(TransactionType.Legacy);  // returns 0
 * ```
 */
export declare function fromTransactionType(type: TransactionType): number;
//# sourceMappingURL=TransactionType.d.ts.map