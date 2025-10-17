export { Contract } from './contract';
export { ContractFactory } from './contract-factory';
export {
    ERC20ClauseBuilder,
    VET_TOKEN_ADDRESS,
    VTHO_TOKEN_ADDRESS,
    TokenUnits
} from './ERC20ClauseBuilder';
export {
    createVET,
    createVTHO,
    vetToWei,
    vthoToWei,
    VETUnits,
    VTHOUnits
} from './tokens';
export type { VET, VTHO } from './tokens';
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
