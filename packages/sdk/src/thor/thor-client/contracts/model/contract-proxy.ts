import { Address, Hex, Revision } from '@common/vcdm';
import { VET, Units } from './VET';
import { Clause } from './Clause';
import { ContractFilter } from './ContractFilter';
import type {
    Abi,
    ExtractAbiEventNames,
    ExtractAbiFunctionNames,
    ExtractAbiFunction,
    AbiParametersToPrimitiveTypes
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
            return async (
                ...args: AbiParametersToPrimitiveTypes<
                    ExtractAbiFunction<TAbi, 'balanceOf'>['inputs'],
                    'inputs'
                >
            ): Promise<unknown[]> => {
                // Check if the clause comment is provided as an argument
                const extractOptionsResult = extractAndRemoveAdditionalOptions(
                    args as unknown[]
                );

                const clauseComment =
                    extractOptionsResult.clauseAdditionalOptions?.comment;
                const revisionValue =
                    extractOptionsResult.clauseAdditionalOptions?.revision;

                const functionAbi = contract.getFunctionAbi(prop);

                const executeCallResult =
                    await contract.contractsModule.executeCall(
                        contract.address,
                        functionAbi,
                        extractOptionsResult.args,
                        {
                            caller:
                                contract.getSigner() !== undefined
                                    ? contract.getSigner()?.address?.toString()
                                    : undefined,
                            ...contract.getContractReadOptions(),
                            comment: clauseComment,
                            revision: revisionValue
                                ? Revision.of(String(revisionValue))
                                : undefined
                        }
                    );

                if (!executeCallResult.success) {
                    throw new Error(
                        `Contract call failed: ${executeCallResult.result.errorMessage || 'Unknown error'}`
                    );
                }

                // Return the properly typed result based on the function's outputs
                return executeCallResult.result.array ?? [];
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
            return async (...args: unknown[]) => {
                if (contract.getSigner() === undefined) {
                    throw new Error(
                        'Caller signer is required to transact with the contract.'
                    );
                }

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

                return await contract.contractsModule.executeTransaction(
                    contract.getSigner()!,
                    contract.address,
                    contract.getFunctionAbi(prop),
                    args,
                    {
                        ...transactionOptions,
                        value:
                            transactionOptions.value ??
                            transactionValue ??
                            '0x0',
                        comment: clauseComment
                    }
                );
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
