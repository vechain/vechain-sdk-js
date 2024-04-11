import {
    type ContractFunctionFilter,
    type ContractFunctionRead,
    type ContractFunctionTransact,
    type TransactionValue
} from './types';
import { type SendTransactionResult } from '../../transactions';
import { type Contract } from './contract';
import { buildError, ERROR_CODES } from '@vechain/sdk-errors';
import { addressUtils, fragment } from '@vechain/sdk-core';
import { type ContractCallResult } from '../types';
import { ContractFilter } from './contract-filter';

/**
 * Creates a Proxy object for reading contract state, allowing for the dynamic invocation of contract read operations.
 * @param contract - The contract instance to create the read proxy for.
 * @returns A Proxy that intercepts calls to read contract functions, automatically handling the invocation with the configured options.
 */
function getReadProxy(contract: Contract): ContractFunctionRead {
    return new Proxy(contract.read, {
        get: (_target, prop) => {
            // Otherwise, assume that the function is a contract method
            return async (...args: unknown[]): Promise<ContractCallResult> => {
                return await contract.thor.contracts.executeContractCall(
                    contract.address,
                    contract.getFunctionFragment(prop),
                    args,
                    {
                        caller:
                            contract.getCallerPrivateKey() !== undefined
                                ? addressUtils.fromPrivateKey(
                                      Buffer.from(
                                          contract.getCallerPrivateKey() as string,
                                          'hex'
                                      )
                                  )
                                : undefined,
                        ...contract.getContractReadOptions()
                    }
                );
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
function getTransactProxy(contract: Contract): ContractFunctionTransact {
    return new Proxy(contract.transact, {
        get: (_target, prop) => {
            // Otherwise, assume that the function is a contract method
            return async (
                ...args: unknown[]
            ): Promise<SendTransactionResult> => {
                if (contract.getCallerPrivateKey() === undefined) {
                    throw buildError(
                        'Contract.getTransactProxy',
                        ERROR_CODES.TRANSACTION.MISSING_PRIVATE_KEY,
                        'Caller private key is required to transact with the contract.',
                        { prop }
                    );
                }

                // get the transaction options for the contract
                const transactionOptions =
                    contract.getContractTransactOptions();

                // check if the transaction value is provided as an argument
                const transactionValue = getTransactionValue(args);

                // if present remove the transaction value argument from the list of arguments
                if (transactionValue !== undefined) {
                    args = args.filter((arg) => !isTransactionValue(arg));
                }

                return await contract.thor.contracts.executeContractTransaction(
                    contract.getCallerPrivateKey() as string,
                    contract.address,
                    contract.getFunctionFragment(prop),
                    args,
                    {
                        ...transactionOptions,
                        value:
                            transactionOptions.value ??
                            transactionValue?.value ??
                            0
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
function getFilterProxy(contract: Contract): ContractFunctionFilter {
    return new Proxy(contract.filters, {
        get: (_target, prop) => {
            // Otherwise, assume that the function is a contract method
            return (...args: unknown[]): ContractFilter => {
                // Create the vechain sdk event fragment starting from the contract ABI event fragment
                const eventFragment = new fragment.Event(
                    contract.getEventFragment(prop)
                );

                // Create a map of encoded filter topics for the event
                const topics = new Map<number, string | undefined>(
                    eventFragment
                        .encodeFilterTopics(args)
                        .map((topic, index) => [index, topic])
                );

                // Create the criteria set for the contract filter
                const criteriaSet = [
                    {
                        address: contract.address,
                        topic0: topics.get(0) as string, // the first topic is always defined since it's the event signature
                        topic1: topics.has(1) ? topics.get(1) : undefined,
                        topic2: topics.has(2) ? topics.get(2) : undefined,
                        topic3: topics.has(3) ? topics.get(3) : undefined,
                        topic4: topics.has(4) ? topics.get(4) : undefined
                    }
                ];

                return new ContractFilter(contract, criteriaSet);
            };
        }
    });
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
 * Type guard function to check if an object is a TransactionValue.
 * @param obj - The object to check.
 * @returns True if the object is a TransactionValue, false otherwise.
 */
function isTransactionValue(obj: unknown): obj is TransactionValue {
    return (obj as TransactionValue).value !== undefined;
}

export { getReadProxy, getTransactProxy, getFilterProxy };
