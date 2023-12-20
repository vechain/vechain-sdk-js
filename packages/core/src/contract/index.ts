import { clauseBuilder } from './contract';
import { coder } from './coder';

/**
 * `contract` provides methods for building clauses for interacting with smart contracts or deploying smart contracts
 * and for encoding and decoding smart contract function input and output.
 */
export const contract = {
    clauseBuilder,
    coder
};
export * from './types.d';
export * from '../../tests/contract/compiler';
