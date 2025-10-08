export { Contract } from './contract';
export { ContractFactory } from './contract-factory';
export { VET, Units } from './VET';
export { ABI, ABIItem, ABIFunction, ABIEvent, ABIContract } from './ABI';
export { Clause } from './Clause';
export type {
    ClauseOptions,
    ContractClause,
    TransactionClause
} from './Clause';
export { ContractFilter } from './ContractFilter';
export * from './types';
export {
    getReadProxy,
    getTransactProxy,
    getFilterProxy,
    getClauseProxy,
    getCriteriaProxy
} from './contract-proxy';

// Viem compatibility exports
export { createViemContract, getContract } from '../viem-adapter';
export type { ViemContract } from '../viem-adapter';
