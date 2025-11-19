import type { Abi, ExtractAbiEventNames, ExtractAbiFunctionNames } from 'abitype';
import { type Contract } from './contract';
import { type ContractFunctionClause, type ContractFunctionCriteria, type ContractFunctionFilter, type ContractFunctionRead, type ContractFunctionTransact } from './types';
/**
 * Creates a Proxy object for reading contract functions, allowing for the dynamic invocation of contract read operations.
 * @param contract - The contract instance
 * @returns A Proxy that intercepts calls to read contract functions, automatically handling the invocation with the configured options.
 */
declare function getReadProxy<TAbi extends Abi>(contract: Contract<TAbi>): ContractFunctionRead<TAbi, ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>>;
/**
 * Creates a Proxy object for transacting with contract functions, allowing for the dynamic invocation of contract transaction operations.
 * @param contract - The contract instance
 * @returns A Proxy that intercepts calls to transaction contract functions, automatically handling the invocation with the configured options.
 * @throws {InvalidTransactionField}
 * @private
 */
declare function getTransactProxy<TAbi extends Abi>(contract: Contract<TAbi>): ContractFunctionTransact<TAbi, ExtractAbiFunctionNames<TAbi, 'nonpayable' | 'payable'>>;
/**
 * Creates a Proxy object for filtering contract events, allowing for the dynamic invocation of contract event filtering operations.
 * @param contract - The contract instance to create the filter proxy for.
 * @returns A Proxy that intercepts calls to filter contract events, automatically handling the invocation with the configured options.
 */
declare function getFilterProxy<TAbi extends Abi>(contract: Contract<TAbi>): ContractFunctionFilter<TAbi, ExtractAbiEventNames<TAbi>>;
/**
 * Creates a Proxy object for interacting with contract functions, allowing for the dynamic invocation of contract functions.
 * @param contract - The contract instance to create the clause proxy for.
 * @returns A Proxy that intercepts calls to contract functions, automatically handling the invocation with the configured options.
 */
declare function getClauseProxy<TAbi extends Abi>(contract: Contract<TAbi>): ContractFunctionClause<TAbi, ExtractAbiFunctionNames<TAbi>>;
/**
 * Create a proxy object for building event criteria for the event filtering.
 * @param contract - The contract instance to create the criteria proxy for.
 * @returns A Proxy that intercepts calls to build event criteria, automatically handling the invocation with the configured options.
 */
declare function getCriteriaProxy<TAbi extends Abi>(contract: Contract<TAbi>): ContractFunctionCriteria<TAbi, ExtractAbiEventNames<TAbi>>;
export { getClauseProxy, getCriteriaProxy, getFilterProxy, getReadProxy, getTransactProxy };
//# sourceMappingURL=contract-proxy.d.ts.map