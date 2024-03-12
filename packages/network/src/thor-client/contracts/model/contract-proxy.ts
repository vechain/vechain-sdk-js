import {
    type ContractFunctionRead,
    type ContractFunctionTransact
} from './types';
import { type SendTransactionResult } from '../../transactions';
import { type Contract } from './contract';
import { buildError, ERROR_CODES } from '@vechain/sdk-errors';
import { addressUtils } from '@vechain/sdk-core';
import { type ContractCallResult } from '../types';

/**
 * Creates a Proxy object for reading contract functions, allowing for the dynamic invocation of contract read operations.
 * @returns A Proxy that intercepts calls to read contract functions, automatically handling the invocation with the configured options.
 * @private
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
                return await contract.thor.contracts.executeContractTransaction(
                    contract.getCallerPrivateKey() as string,
                    contract.address,
                    contract.getFunctionFragment(prop),
                    args,
                    contract.getContractTransactOptions()
                );
            };
        }
    });
}

export { getReadProxy, getTransactProxy };
