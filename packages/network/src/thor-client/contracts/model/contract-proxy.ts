import {
    type ClauseAdditionalOptions,
    type ClauseComment,
    type ContractFunctionClause,
    type ContractFunctionCriteria,
    type ContractFunctionFilter,
    type ContractFunctionRead,
    type ContractFunctionTransact,
    type TransactionValue
} from './types';
import { type SendTransactionResult } from '../../transactions';
import { type Contract } from './contract';
import { buildError, ERROR_CODES } from '@vechain/sdk-errors';
import { clauseBuilder, fragment } from '@vechain/sdk-core';
import { type ContractCallResult, type ContractClause } from '../types';
import { ContractFilter } from './contract-filter';
import { type VeChainSigner } from '../../../signer';
import { type FilterCriteria } from '../../logs';
import type {
    Abi,
    AbiParametersToPrimitiveTypes,
    ExtractAbiEventNames,
    ExtractAbiFunction,
    ExtractAbiFunctionNames
} from 'abitype';

/**
 * Creates a Proxy object for reading contract state, allowing for the dynamic invocation of contract read operations.
 * @param contract - The contract instance to create the read proxy for.
 * @returns A Proxy that intercepts calls to read contract functions, automatically handling the invocation with the configured options.
 */
function getReadProxy<TAbi extends Abi>(
    contract: Contract<TAbi>
): ContractFunctionRead<TAbi, ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>> {
    return new Proxy(contract.read, {
        get: (_target, prop) => {
            // Otherwise, assume that the function is a contract method
            return async (
                ...args: AbiParametersToPrimitiveTypes<
                    ExtractAbiFunction<TAbi, 'balanceOf'>['inputs'],
                    'inputs'
                >
            ): Promise<ContractCallResult> => {
                // check if the clause comment is provided as an argument

                const extractOptionsResult = extractAndRemoveAdditionalOptions(
                    args as unknown[]
                );

                const clauseComment =
                    extractOptionsResult.clauseAdditionalOptions?.comment;

                return (await contract.thor.contracts.executeCall(
                    contract.address,
                    contract.getFunctionFragment(prop),
                    extractOptionsResult.args,
                    {
                        caller:
                            contract.getSigner() !== undefined
                                ? await contract.getSigner()?.getAddress()
                                : undefined,
                        ...contract.getContractReadOptions(),
                        comment: clauseComment
                    }
                )) as ContractCallResult;
            };
        }
    });
}

/**
 * Creates a Proxy object for transacting with contract functions, allowing for the dynamic invocation of contract transaction operations.
 * @param contract - The contract instance
 * @returns A Proxy that intercepts calls to transaction contract functions, automatically handling the invocation with the configured options.
 * @private
 */
function getTransactProxy<TAbi extends Abi>(
    contract: Contract<TAbi>
): ContractFunctionTransact<
    TAbi,
    ExtractAbiFunctionNames<TAbi, 'nonpayable' | 'payable'>
> {
    return new Proxy(contract.transact, {
        get: (_target, prop) => {
            // Otherwise, assume that the function is a contract method
            return async (
                ...args: unknown[]
            ): Promise<SendTransactionResult> => {
                if (contract.getSigner() === undefined) {
                    throw buildError(
                        'Contract.getTransactProxy',
                        ERROR_CODES.TRANSACTION.MISSING_PRIVATE_KEY,
                        'Caller signer is required to transact with the contract.',
                        { prop }
                    );
                }

                // get the transaction options for the contract
                const transactionOptions =
                    contract.getContractTransactOptions();

                // check if the transaction value is provided as an argument

                const extractAdditionalOptionsResult =
                    extractAndRemoveAdditionalOptions(args);

                const transactionValue =
                    extractAdditionalOptionsResult.clauseAdditionalOptions
                        ?.value;

                const clauseComment =
                    extractAdditionalOptionsResult.clauseAdditionalOptions
                        ?.comment;

                args = extractAdditionalOptionsResult.args;

                return await contract.thor.contracts.executeTransaction(
                    contract.getSigner() as VeChainSigner,
                    contract.address,
                    contract.getFunctionFragment(prop),
                    args,
                    {
                        ...transactionOptions,
                        value:
                            transactionOptions.value ?? transactionValue ?? 0,
                        comment: clauseComment
                    }
                );
            };
        }
    });
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
            // Otherwise, assume that the function is a contract method
            return (...args: unknown[]): ContractFilter<TAbi> => {
                const criteriaSet = buildCriteria(contract, prop, args);

                return new ContractFilter<TAbi>(contract, [criteriaSet]);
            };
        }
    });
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
            return (...args: unknown[]): ContractClause => {
                // get the transaction options for the contract
                const transactionOptions =
                    contract.getContractTransactOptions();

                // check if the transaction value is provided as an argument
                const extractAdditionalOptionsResult =
                    extractAndRemoveAdditionalOptions(args);

                const transactionValue =
                    extractAdditionalOptionsResult.clauseAdditionalOptions
                        ?.value;

                const clauseComment =
                    extractAdditionalOptionsResult.clauseAdditionalOptions
                        ?.comment;

                args = extractAdditionalOptionsResult.args;

                // return the contract clause
                return {
                    clause: clauseBuilder.functionInteraction(
                        contract.address,
                        contract.getFunctionFragment(prop),
                        args,
                        transactionOptions.value ?? transactionValue ?? 0,
                        {
                            comment: clauseComment
                        }
                    ),
                    functionFragment: contract.getFunctionFragment(prop)
                };
            };
        }
    });
}

/**
 * Create a proxy object for building event criteria for the event filtering.
 * @param contract - The contract instance to create the criteria proxy for.
 * @returns A Proxy that intercepts calls to build event criteria, automatically handling the invocation with the configured options.
 */
function getCriteriaProxy<TAbi extends Abi>(
    contract: Contract<TAbi>
): ContractFunctionCriteria<TAbi, ExtractAbiEventNames<TAbi>> {
    return new Proxy(contract.criteria, {
        get: (_target, prop) => {
            return (...args: unknown[]): FilterCriteria => {
                return buildCriteria(contract, prop, args);
            };
        }
    });
}

/**
 * Builds the filter criteria for the contract filter.
 * @param contract - The contract instance to create the criteria for.
 * @param prop - The property name of the contract event.
 * @param args - The arguments to filter the event.
 * @returns The event criteria for the contract filter.
 */
function buildCriteria<TAbi extends Abi>(
    contract: Contract<TAbi>,
    prop: string | symbol,
    args: unknown[]
): FilterCriteria {
    // Create the VeChain sdk event fragment starting from the contract ABI event fragment
    const eventFragment = new fragment.Event(contract.getEventFragment(prop));

    // Create a map of encoded filter topics for the event
    const topics = new Map<number, string | undefined>(
        eventFragment
            .encodeFilterTopics(args)
            .map((topic, index) => [index, topic])
    );

    // Create the criteria set for the contract filter
    return {
        criteria: {
            address: contract.address,
            topic0: topics.get(0) as string, // the first topic is always defined since it's the event signature
            topic1: topics.has(1) ? topics.get(1) : undefined,
            topic2: topics.has(2) ? topics.get(2) : undefined,
            topic3: topics.has(3) ? topics.get(3) : undefined,
            topic4: topics.has(4) ? topics.get(4) : undefined
        },
        eventFragment: eventFragment.fragment
    };
}

function extractAndRemoveAdditionalOptions(args: unknown[]): {
    args: unknown[];
    clauseAdditionalOptions: ClauseAdditionalOptions | undefined;
} {
    // check if the transaction value is provided as an argument
    const transactionValue = getTransactionValue(args);
    const clauseComment = getClauseComment(args);

    // if present remove the transaction value argument from the list of arguments
    if (transactionValue !== undefined || clauseComment !== undefined) {
        args = args.filter(
            (arg) => !(isTransactionValue(arg) || isTransactionComment(arg))
        );
    }

    return {
        args,
        clauseAdditionalOptions: {
            value: transactionValue?.value,
            comment: clauseComment?.comment
        }
    };
}

/**
 * Extracts the transaction value from the list of arguments, if present.
 * @param args - The list of arguments to search for the transaction value.
 * @returns The transaction value object, if found in the arguments list.
 */
function getTransactionValue(args: unknown[]): TransactionValue | undefined {
    return args.find((arg) => isTransactionValue(arg)) as
        | TransactionValue
        | undefined;
}

/**
 * Extracts the clause comment from the list of arguments, if present.
 * @param args - The list of arguments to search for the clause comment.
 * @returns The clause comment object, if found in the arguments list.
 */
function getClauseComment(args: unknown[]): ClauseComment | undefined {
    return args.find((arg) => isTransactionComment(arg)) as
        | ClauseComment
        | undefined;
}

/**
 * Type guard function to check if an object is a TransactionValue.
 * @param obj - The object to check.
 * @returns True if the object is a TransactionValue, false otherwise.
 */
function isTransactionValue(obj: unknown): obj is ClauseAdditionalOptions {
    return (obj as ClauseAdditionalOptions).value !== undefined;
}

/**
 * Type guard function to check if an object is a ClauseComment.
 * @param obj - The object to check.
 * @returns True if the object is a ClauseComment, false otherwise.
 */
function isTransactionComment(obj: unknown): obj is ClauseAdditionalOptions {
    return (obj as ClauseAdditionalOptions).comment !== undefined;
}

export {
    getReadProxy,
    getTransactProxy,
    getFilterProxy,
    getClauseProxy,
    getCriteriaProxy
};
