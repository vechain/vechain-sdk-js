/**
 * Options for creating a clause.
 */
interface ClauseOptions {
    /**
     * Optional comment for the clause, helpful for displaying what the clause is doing.
     */
    comment?: string;

    /**
     * Optional ABI for the contract method invocation.
     */
    includeABI?: boolean;
}

export type { ClauseOptions };
