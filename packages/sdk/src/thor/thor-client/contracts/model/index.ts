export { Contract } from './contract';
export { ContractFactory } from './contract-factory';
export { VET, Units } from './VET';
export { VTHO } from './VTHO';
export { ABI, ABIItem, ABIFunction, ABIEvent, ABIContract } from './ABI';
export { Clause } from '@thor/thor-client/model/transactions/Clause';
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
