/* eslint-disable */
// TODO: Contracts module is pending rework - lint errors will be fixed during refactor
import type { ClauseOptions } from './ClauseOptions';

/**
 * Contract-specific clause options that extend the main SDK's ClauseOptions
 */
export interface ContractClauseOptions extends ClauseOptions {
    /**
     * The value to send with the transaction (in wei)
     */
    value?: bigint;

    /**
     * The revision to use for the call
     */
    revision?: string | number;
}

