export { Contract } from './contract';
export { ContractFactory } from './contract-factory';
export { ERC20ClauseBuilder, TokenUnits } from './ERC20ClauseBuilder';
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
export type { SendTransactionResult } from './SendTransactionResult';
export type { ClauseOptions } from './ClauseOptions';
export type { ContractClauseOptions } from './ContractClauseOptions';
export type { ClauseComment } from './ClauseComment';
export type { ContractFunctionRead } from './ContractFunctionRead';
export type { ContractFunctionTransact } from './ContractFunctionTransact';
export type { ContractFunctionFilter } from './ContractFunctionFilter';
export type { ContractFunctionClause } from './ContractFunctionClause';
export type { ContractFunctionCriteria } from './ContractFunctionCriteria';
export {
    getReadProxy,
    getTransactProxy,
    getFilterProxy,
    getClauseProxy,
    getCriteriaProxy
} from './contract-proxy';
export type { DeployParams } from './DeployParams';

// Viem compatibility exports
export { createViemContract, getContract } from '../viem-adapter';
export type { ViemContract } from '../viem-adapter';
