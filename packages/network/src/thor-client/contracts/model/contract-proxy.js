"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClauseProxy = getClauseProxy;
exports.getCriteriaProxy = getCriteriaProxy;
exports.getFilterProxy = getFilterProxy;
exports.getReadProxy = getReadProxy;
exports.getTransactProxy = getTransactProxy;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const contract_filter_1 = require("./contract-filter");
/**
 * Creates a Proxy object for reading contract functions, allowing for the dynamic invocation of contract read operations.
 * @param contract - The contract instance
 * @returns A Proxy that intercepts calls to read contract functions, automatically handling the invocation with the configured options.
 */
function getReadProxy(contract) {
    return new Proxy(contract.read, {
        get: (_target, prop) => {
            // Otherwise, assume that the function is a contract method
            return async (...args) => {
                // check if the clause comment is provided as an argument
                const extractOptionsResult = extractAndRemoveAdditionalOptions(args);
                const clauseAdditionalOptions = extractOptionsResult.clauseAdditionalOptions;
                const functionAbi = contract.getFunctionAbi(prop);
                const callOptions = {
                    caller: contract.getSigner() !== undefined
                        ? await contract.getSigner()?.getAddress()
                        : undefined,
                    ...contract.getContractReadOptions(),
                    includeABI: true
                };
                if (clauseAdditionalOptions?.comment !== undefined) {
                    callOptions.comment = clauseAdditionalOptions.comment;
                }
                if (clauseAdditionalOptions?.revision !== undefined) {
                    callOptions.revision = sdk_core_1.Revision.of(clauseAdditionalOptions.revision);
                }
                const executeCallResult = await contract.contractsModule.executeCall(contract.address, functionAbi, extractOptionsResult.args, callOptions);
                if (!executeCallResult.success) {
                    throw new sdk_errors_1.ContractCallError(functionAbi.stringSignature, executeCallResult.result.errorMessage, {
                        contractAddress: contract.address
                    });
                }
                // Return the properly typed result based on the function's outputs
                return executeCallResult.result.array ?? [];
            };
        }
    });
}
/**
 * Creates a Proxy object for transacting with contract functions, allowing for the dynamic invocation of contract transaction operations.
 * @param contract - The contract instance
 * @returns A Proxy that intercepts calls to transaction contract functions, automatically handling the invocation with the configured options.
 * @throws {InvalidTransactionField}
 * @private
 */
function getTransactProxy(contract) {
    return new Proxy(contract.transact, {
        get: (_target, prop) => {
            // Otherwise, assume that the function is a contract method
            return async (...args) => {
                if (contract.getSigner() === undefined) {
                    throw new sdk_errors_1.InvalidTransactionField('getTransactProxy()', 'Caller signer is required to transact with the contract.', { fieldName: 'signer', prop });
                }
                // get the transaction options for the contract
                const transactionOptions = contract.getContractTransactOptions();
                // check if the transaction value is provided as an argument
                const extractAdditionalOptionsResult = extractAndRemoveAdditionalOptions(args);
                const transactionValue = extractAdditionalOptionsResult.clauseAdditionalOptions
                    ?.value;
                const clauseComment = extractAdditionalOptionsResult.clauseAdditionalOptions
                    ?.comment;
                args = extractAdditionalOptionsResult.args;
                return await contract.contractsModule.executeTransaction(contract.getSigner(), contract.address, contract.getFunctionAbi(prop), args, {
                    ...transactionOptions,
                    value: transactionOptions.value ??
                        transactionValue ??
                        '0x0',
                    comment: clauseComment,
                    includeABI: true
                });
            };
        }
    });
}
/**
 * Creates a Proxy object for filtering contract events, allowing for the dynamic invocation of contract event filtering operations.
 * @param contract - The contract instance to create the filter proxy for.
 * @returns A Proxy that intercepts calls to filter contract events, automatically handling the invocation with the configured options.
 */
function getFilterProxy(contract) {
    return new Proxy(contract.filters, {
        get: (_target, prop) => {
            return (
            // eslint-disable-next-line sonarjs/use-type-alias
            args) => {
                const criteriaSet = buildCriteria(contract, prop, args);
                return new contract_filter_1.ContractFilter(contract, [criteriaSet]);
            };
        }
    });
}
/**
 * Creates a Proxy object for interacting with contract functions, allowing for the dynamic invocation of contract functions.
 * @param contract - The contract instance to create the clause proxy for.
 * @returns A Proxy that intercepts calls to contract functions, automatically handling the invocation with the configured options.
 */
function getClauseProxy(contract) {
    return new Proxy(contract.clause, {
        get: (_target, prop) => {
            return (...args) => {
                // get the transaction options for the contract
                const transactionOptions = contract.getContractTransactOptions();
                // check if the transaction value is provided as an argument
                const extractAdditionalOptionsResult = extractAndRemoveAdditionalOptions(args);
                const transactionValue = extractAdditionalOptionsResult.clauseAdditionalOptions
                    ?.value;
                const clauseComment = extractAdditionalOptionsResult.clauseAdditionalOptions
                    ?.comment;
                args = extractAdditionalOptionsResult.args;
                // return the contract clause
                return {
                    clause: sdk_core_1.Clause.callFunction(sdk_core_1.Address.of(contract.address), contract.getFunctionAbi(prop), args, sdk_core_1.VET.of(transactionOptions.value ?? transactionValue ?? 0, sdk_core_1.Units.wei), {
                        comment: clauseComment,
                        includeABI: true
                    }),
                    functionAbi: contract.getFunctionAbi(prop)
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
function getCriteriaProxy(contract) {
    return new Proxy(contract.criteria, {
        get: (_target, prop) => {
            return (args) => {
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
function buildCriteria(contract, prop, args) {
    // Create the VeChain sdk event ABI
    const eventAbi = contract.getEventAbi(prop);
    // Create a map of encoded filter topics for the event
    const topics = new Map(eventAbi
        .encodeFilterTopicsNoNull(args)
        .map((topic, index) => [index, topic]));
    // Create the criteria set for the contract filter
    return {
        criteria: {
            address: contract.address,
            topic0: topics.get(0), // the first topic is always defined since it's the event signature
            topic1: topics.has(1) ? topics.get(1) : undefined,
            topic2: topics.has(2) ? topics.get(2) : undefined,
            topic3: topics.has(3) ? topics.get(3) : undefined,
            topic4: topics.has(4) ? topics.get(4) : undefined
        },
        eventAbi
    };
}
/**
 * Extracts the transaction value and comment from the list of arguments, if present.
 * @param args - The list of arguments to search for the transaction value.
 * @returns The transaction value and comment object, if found in the arguments list. Also returns the list of arguments with the clause options removed.
 */
function extractAndRemoveAdditionalOptions(args) {
    // check if the transaction value is provided as an argument
    const transactionValue = getTransactionValue(args);
    const clauseComment = getClauseComment(args);
    const clauseRevision = getRevision(args);
    // if present remove the transaction value argument from the list of arguments
    if (transactionValue !== undefined ||
        clauseComment !== undefined ||
        clauseRevision !== undefined) {
        args = args.filter((arg) => !(isTransactionValue(arg) ||
            isTransactionComment(arg) ||
            isRevision(arg)));
    }
    return {
        args,
        clauseAdditionalOptions: {
            value: transactionValue?.value,
            comment: clauseComment?.comment,
            revision: clauseRevision?.revision
        }
    };
}
/**
 * Extracts the transaction value from the list of arguments, if present.
 * @param args - The list of arguments to search for the transaction value.
 * @returns The transaction value object, if found in the arguments list.
 */
function getTransactionValue(args) {
    const found = args.find((arg) => isTransactionValue(arg));
    if (!found)
        return undefined;
    return {
        value: found.value.toString()
    };
}
/**
 * Extracts the clause comment from the list of arguments, if present.
 * @param args - The list of arguments to search for the clause comment.
 * @returns The clause comment object, if found in the arguments list.
 */
function getClauseComment(args) {
    return args.find((arg) => isTransactionComment(arg));
}
/**
 * Extracts the revision from the list of arguments, if present.
 * @param args - The list of arguments to search for the revision.
 * @returns The revision object, if found in the arguments list.
 */
function getRevision(args) {
    return args.find((arg) => isRevision(arg));
}
/**
 * Type guard function to check if an object is a TransactionValue.
 * @param obj - The object to check.
 * @returns True if the object is a TransactionValue, false otherwise.
 */
function isTransactionValue(obj) {
    return obj.value !== undefined;
}
/**
 * Type guard function to check if an object is a ClauseComment.
 * @param obj - The object to check.
 * @returns True if the object is a ClauseComment, false otherwise.
 */
function isTransactionComment(obj) {
    return obj.comment !== undefined;
}
/**
 * Type guard function to check if an object is a revision.
 * @param obj - The object to check.
 * @returns True if the object is a revision, false otherwise.
 */
function isRevision(obj) {
    return obj.revision !== undefined;
}
