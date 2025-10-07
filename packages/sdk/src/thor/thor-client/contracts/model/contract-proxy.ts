import { Address, Hex } from '@common/vcdm';
import { VET, Units } from './VET';
import { Clause } from './Clause';
import { ContractFilter } from './ContractFilter';
import type {
    Abi,
    ExtractAbiEventNames,
    ExtractAbiFunctionNames
} from 'abitype';
import type { Contract } from './contract';
import type {
    ClauseAdditionalOptions,
    ContractFunctionClause,
    ContractFunctionCriteria,
    ContractFunctionFilter,
    ContractFunctionRead,
    ContractFunctionTransact
} from './types';

/**
 * Extracts and removes additional options from function arguments
 */
function extractAndRemoveAdditionalOptions(args: unknown[]): {
    args: unknown[];
    clauseAdditionalOptions?: ClauseAdditionalOptions;
} {
    // Simple implementation - in a full version this would be more sophisticated
    // For now, assume additional options are passed as the last argument if it's an object
    if (
        args.length > 0 &&
        typeof args[args.length - 1] === 'object' &&
        args[args.length - 1] !== null
    ) {
        const lastArg = args[args.length - 1] as Record<string, unknown>;
        if (
            'value' in lastArg ||
            'comment' in lastArg ||
            'revision' in lastArg
        ) {
            return {
                args: args.slice(0, -1),
                clauseAdditionalOptions: lastArg as ClauseAdditionalOptions
            };
        }
    }
    return { args };
}

/**
 * Builds criteria for event filtering
 */
function buildCriteria<TAbi extends Abi>(
    contract: Contract<TAbi>,
    eventName: string | symbol,
    args?: Record<string, unknown> | unknown[] | undefined
): unknown {
    // Simplified implementation - would build proper event criteria
    return {
        contract: contract.address,
        event: eventName.toString(),
        args: args || []
    };
}

/**
 * Creates a Proxy object for reading contract functions, allowing for the dynamic invocation of contract read operations.
 * @param contract - The contract instance to create the read proxy for.
 * @returns A Proxy that intercepts calls to contract read functions, automatically handling the invocation with the configured options.
 */
function getReadProxy<TAbi extends Abi>(
    contract: Contract<TAbi>
): ContractFunctionRead<TAbi, ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>> {
    return new Proxy(contract.read, {
        get: (_target, prop) => {
            return async (...args: unknown[]): Promise<unknown[]> => {
                // Extract additional options if provided
                const extractResult = extractAndRemoveAdditionalOptions(args);
                const options = extractResult.clauseAdditionalOptions;

                // Get the function ABI
                const functionAbi = contract.getFunctionAbi(prop);

                // Use the contract's read method directly
                const readMethod = contract.read[prop.toString()];
                if (!readMethod) {
                    throw new Error(`Read method ${prop.toString()} not found`);
                }

                return await readMethod(...extractResult.args);
            };
        }
    }) as ContractFunctionRead<
        TAbi,
        ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>
    >;
}

/**
 * Creates a Proxy object for transacting with contract functions, allowing for the dynamic invocation of contract write operations.
 * @param contract - The contract instance to create the transact proxy for.
 * @returns A Proxy that intercepts calls to contract write functions, automatically handling the invocation with the configured options.
 */
function getTransactProxy<TAbi extends Abi>(
    contract: Contract<TAbi>
): ContractFunctionTransact<
    TAbi,
    ExtractAbiFunctionNames<TAbi, 'payable' | 'nonpayable'>
> {
    return new Proxy(contract.transact, {
        get: (_target, prop) => {
            return async (...args: unknown[]): Promise<unknown> => {
                // Extract additional options if provided
                const extractResult = extractAndRemoveAdditionalOptions(args);
                const options = extractResult.clauseAdditionalOptions;

                // Get the function ABI
                const functionAbi = contract.getFunctionAbi(prop);

                // Use the contract's transact method directly
                const transactMethod = contract.transact[prop.toString()];
                if (!transactMethod) {
                    throw new Error(
                        `Transact method ${prop.toString()} not found`
                    );
                }

                return await transactMethod(...extractResult.args);
            };
        }
    }) as ContractFunctionTransact<
        TAbi,
        ExtractAbiFunctionNames<TAbi, 'payable' | 'nonpayable'>
    >;
}

/**
 * Creates a Proxy object for filtering contract events, allowing for the dynamic invocation of contract event filtering operations.
 * @param contract - The contract instance to create the filter proxy for.
 * @returns A Proxy that intercepts calls to filter contract events, automatically handling the invocation with the configured options.
 */
function getFilterProxy<TAbi extends Abi>(
    contract: Contract<TAbi>
): ContractFunctionFilter<TAbi, ExtractAbiEventNames<TAbi>> {
    return new Proxy(contract.filters, {
        get: (_target, prop) => {
            return (
                args?: Record<string, unknown> | unknown[] | undefined
            ): ContractFilter<TAbi> => {
                const criteriaSet = buildCriteria(contract, prop, args);
                return new ContractFilter<TAbi>(contract, [criteriaSet]);
            };
        }
    }) as ContractFunctionFilter<TAbi, ExtractAbiEventNames<TAbi>>;
}

/**
 * Creates a Proxy object for interacting with contract functions, allowing for the dynamic invocation of contract functions.
 * @param contract - The contract instance to create the clause proxy for.
 * @returns A Proxy that intercepts calls to contract functions, automatically handling the invocation with the configured options.
 */
function getClauseProxy<TAbi extends Abi>(
    contract: Contract<TAbi>
): ContractFunctionClause<TAbi, ExtractAbiFunctionNames<TAbi>> {
    return new Proxy(contract.clause, {
        get: (_target, prop) => {
            return (...args: unknown[]): any => {
                // Get the transaction options for the contract
                const transactionOptions =
                    contract.getContractTransactOptions();

                // Check if the transaction value is provided as an argument
                const extractAdditionalOptionsResult =
                    extractAndRemoveAdditionalOptions(args);

                const transactionValue =
                    extractAdditionalOptionsResult.clauseAdditionalOptions
                        ?.value;
                const clauseComment =
                    extractAdditionalOptionsResult.clauseAdditionalOptions
                        ?.comment;

                args = extractAdditionalOptionsResult.args;

                // Get the function ABI
                const functionAbi = contract.getFunctionAbi(prop);

                // Create the clause
                const clause = Clause.callFunction(
                    Address.of(contract.address),
                    contract.encodeFunctionData(prop.toString(), args),
                    VET.of(
                        transactionOptions.value ?? transactionValue ?? 0,
                        Units.wei
                    ).bi,
                    clauseComment ?? undefined
                );

                // Return the contract clause
                return {
                    clause,
                    functionAbi
                };
            };
        }
    }) as ContractFunctionClause<TAbi, ExtractAbiFunctionNames<TAbi>>;
}

/**
 * Creates a Proxy object for criteria building, allowing for the dynamic creation of event criteria.
 * @param contract - The contract instance to create the criteria proxy for.
 * @returns A Proxy that intercepts calls to build event criteria.
 */
function getCriteriaProxy<TAbi extends Abi>(
    contract: Contract<TAbi>
): ContractFunctionCriteria<TAbi, ExtractAbiEventNames<TAbi>> {
    return new Proxy(contract.criteria, {
        get: (_target, prop) => {
            return (
                args?: Record<string, unknown> | unknown[] | undefined
            ): unknown => {
                return buildCriteria(contract, prop, args);
            };
        }
    }) as ContractFunctionCriteria<TAbi, ExtractAbiEventNames<TAbi>>;
}

export {
    getReadProxy,
    getTransactProxy,
    getFilterProxy,
    getClauseProxy,
    getCriteriaProxy
};
