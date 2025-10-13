import { Address, Hex, Revision } from '@common/vcdm';
import type { AbiParameter } from 'abitype';
import { IllegalArgumentError, InvalidTransactionField } from '@common/errors';
import { log } from '@common/logging';
import { encodeFunctionData } from 'viem';
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
    ContractClauseOptions,
    ContractFunctionClause,
    ContractFunctionCriteria,
    ContractFunctionFilter,
    ContractFunctionRead,
    ContractFunctionTransact
} from './types';

/**
 * Extracts and removes additional options from function arguments
 */
function extractAndRemoveAdditionalOptions(args: AbiParameter[]): {
    args: AbiParameter[];
    clauseAdditionalOptions?: ContractClauseOptions;
} {
    // Ensure args is an array
    if (!Array.isArray(args)) {
        log.error({
            message: 'extractAndRemoveAdditionalOptions: args is not an array',
            context: { args }
        });
        return { args: [] };
    }

    // Simple implementation - in a full version this would be more sophisticated
    // For now, assume additional options are passed as the last argument if it's an object
    if (
        args.length > 0 &&
        typeof args[args.length - 1] === 'object' &&
        args[args.length - 1] !== null
    ) {
        const lastArg = args[args.length - 1] as Record<
            string,
            string | number | bigint | boolean
        >;
        if (
            'value' in lastArg ||
            'comment' in lastArg ||
            'revision' in lastArg
        ) {
            return {
                args: args.slice(0, -1),
                clauseAdditionalOptions: lastArg as ContractClauseOptions
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
    args?:
        | Record<string, string | number | bigint | boolean>
        | AbiParameter[]
        | undefined
): {
    eventName: string;
    args: AbiParameter[];
    address: string;
    topics: string[];
} {
    // Simplified implementation - would build proper event criteria
    const processedArgs = Array.isArray(args) ? args : [];
    return {
        eventName: eventName.toString(),
        args: processedArgs,
        address: contract.address.toString(),
        topics: []
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
            ): Promise<
                (string | number | bigint | boolean | Address | Hex)[]
            > => {
                // Check if the clause comment is provided as an argument
                const extractOptionsResult = extractAndRemoveAdditionalOptions(
                    args as AbiParameter[]
                );

                const clauseComment =
                    extractOptionsResult.clauseAdditionalOptions?.comment;
                const revisionValue =
                    extractOptionsResult.clauseAdditionalOptions?.revision;

                const functionAbi = contract.getFunctionAbi(prop);
                if (!functionAbi) {
                    throw new IllegalArgumentError(
                        'ContractProxy.getReadProxy',
                        'Function ABI not found',
                        { functionName: prop.toString() }
                    );
                }

                const executeCallResult =
                    await contract.contractsModule.executeCall(
                        contract.address,
                        functionAbi,
                        extractOptionsResult.args as any,
                        {
                            caller: contract.getSigner()?.address,
                            ...contract.getContractReadOptions(),
                            comment: clauseComment,
                            revision: revisionValue
                                ? Revision.of(String(revisionValue))
                                : undefined
                        }
                    );

                if (!executeCallResult.success) {
                    throw new IllegalArgumentError(
                        'ContractProxy.getReadProxy',
                        'Contract call failed',
                        {
                            functionName: prop.toString(),
                            errorMessage:
                                executeCallResult.result.errorMessage ||
                                'Unknown error',
                            contractAddress: contract.address.toString()
                        }
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
            return async (...args: AbiParameter[]) => {
                if (contract.getSigner() === undefined) {
                    throw new InvalidTransactionField(
                        'ContractProxy.getTransactProxy',
                        'Caller signer is required to transact with the contract.',
                        { fieldName: 'signer', functionName: prop.toString() }
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

                const functionAbi = contract.getFunctionAbi(prop);
                if (!functionAbi) {
                    throw new IllegalArgumentError(
                        'ContractProxy.getTransactProxy',
                        'Function ABI not found',
                        { functionName: prop.toString() }
                    );
                }

                return await contract.contractsModule.executeTransaction(
                    contract.getSigner()!,
                    contract.address,
                    functionAbi,
                    args as any,
                    {
                        ...transactionOptions,
                        value:
                            transactionOptions.value ??
                            (typeof transactionValue === 'string'
                                ? BigInt(transactionValue)
                                : transactionValue) ??
                            0n,
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
                args?:
                    | Record<string, string | number | bigint | boolean>
                    | AbiParameter[]
                    | undefined
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
    return new Proxy(contract.clause as any, {
        get: (_target, prop) => {
            return (
                ...args: AbiParameter[]
            ): {
                to: string;
                data: string;
                value: bigint;
                comment?: string;
            } => {
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
                const encodedData = encodeFunctionData({
                    abi: contract.abi as any,
                    functionName: prop.toString() as any,
                    args: args as any
                });
                const clause = Clause.callFunction(
                    Address.of(contract.address),
                    encodedData,
                    VET.of(
                        transactionOptions.value ?? transactionValue ?? 0,
                        Units.wei
                    ).bi,
                    clauseComment ?? undefined
                );

                // Return the contract clause
                return {
                    to: clause.to?.toString() ?? '',
                    data: clause.data?.toString() ?? '',
                    value: clause.value ?? 0n,
                    comment: clause.comment ?? undefined
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
                args?:
                    | Record<string, string | number | bigint | boolean>
                    | AbiParameter[]
                    | undefined
            ): {
                eventName: string;
                args: AbiParameter[];
                address: string;
                topics: string[];
            } => {
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
