import {
    addressUtils,
    coder,
    type FunctionFragment,
    type InterfaceAbi
} from '@vechain/vechain-sdk-core';
import type {
    SendTransactionResult,
    TransactionReceipt
} from '../../transactions';
import { type ThorClient } from '../../thor-client';
import type {
    ContractCallOptions,
    ContractCallResult,
    ContractTransactionOptions
} from '../types';
import { buildError, ERROR_CODES } from '@vechain/vechain-sdk-errors';

export type ContractFunction<T = unknown> = (...args: unknown[]) => Promise<T>;

type ContractFunctionRead = Record<string, ContractFunction>;

type ContractFunctionTransact = Record<
    string,
    ContractFunction<SendTransactionResult>
>;

/**
 * A class representing a smart contract deployed on the blockchain.
 */
class Contract {
    readonly thor: ThorClient;
    readonly address: string;
    readonly abi: InterfaceAbi;
    callerPrivateKey: string;

    readonly deployTransactionReceipt: TransactionReceipt | undefined;

    public read: ContractFunctionRead = {};
    public transact: ContractFunctionTransact = {};

    private contractCallOptions: ContractCallOptions = {};
    private contractTransactionOptions: ContractTransactionOptions = {};

    /**
     * Initializes a new instance of the `Contract` class.
     * @param address The address of the contract.
     * @param abi The Application Binary Interface (ABI) of the contract, which defines the contract's methods and events.
     * @param thor An instance of ThorClient to interact with the blockchain.
     * @param callerPrivateKey The private key used for signing transactions.
     * @param transactionReceipt (Optional) The transaction receipt of the contract deployment.
     */
    constructor(
        address: string,
        abi: InterfaceAbi,
        thor: ThorClient,
        callerPrivateKey: string,
        transactionReceipt?: TransactionReceipt
    ) {
        this.abi = abi;
        this.thor = thor;
        this.address = address;
        this.deployTransactionReceipt = transactionReceipt;
        this.callerPrivateKey = callerPrivateKey;
        this.read = this.getReadProxy();
        this.transact = this.getTransactProxy();
    }

    /**
     * Sets the options for contract calls.
     * @param options - The contract call options to set.
     * @returns The updated contract call options.
     */
    public setContractReadOptions(
        options: ContractCallOptions
    ): ContractCallOptions {
        this.contractCallOptions = options;
        // initialize the proxy with the new options
        this.read = this.getReadProxy();
        return this.contractCallOptions;
    }

    /**
     * Clears the current contract call options, resetting them to an empty object.
     */
    public clearContractReadOptions(): void {
        this.contractCallOptions = {};
        this.read = this.getReadProxy();
    }

    /**
     * Sets the options for contract transactions.
     * @param options - The contract transaction options to set.
     * @returns The updated contract transaction options.
     */
    public setContractTransactOptions(
        options: ContractTransactionOptions
    ): ContractTransactionOptions {
        this.contractTransactionOptions = options;
        // initialize the proxy with the new options
        this.transact = this.getTransactProxy();
        return this.contractTransactionOptions;
    }

    /**
     * Clears the current contract transaction options, resetting them to an empty object.
     */
    public clearContractTransactOptions(): void {
        this.contractTransactionOptions = {};
        this.transact = this.getTransactProxy();
    }

    /**
     * Sets the private key of the caller for signing transactions.
     * @param privateKey
     */
    public setCallerPrivateKey(privateKey: string): string {
        this.callerPrivateKey = privateKey;
        this.transact = this.getTransactProxy();
        this.read = this.getReadProxy();
        return this.callerPrivateKey;
    }

    /**
     * Creates a Proxy object for reading contract functions, allowing for the dynamic invocation of contract read operations.
     * @returns A Proxy that intercepts calls to read contract functions, automatically handling the invocation with the configured options.
     * @private
     */
    private getReadProxy(): ContractFunctionRead {
        return new Proxy(this.read, {
            get: (_target, prop) => {
                // Otherwise, assume that the function is a contract method
                return async (
                    ...args: unknown[]
                ): Promise<ContractCallResult> => {
                    return await this.thor.contracts.executeContractCall(
                        this.address,
                        this.getFunctionFragment(prop),
                        args,
                        {
                            caller: addressUtils.fromPrivateKey(
                                Buffer.from(this.callerPrivateKey, 'hex')
                            ),
                            ...this.contractCallOptions
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
    private getTransactProxy(): ContractFunctionTransact {
        return new Proxy(this.transact, {
            get: (_target, prop) => {
                // Otherwise, assume that the function is a contract method
                return async (
                    ...args: unknown[]
                ): Promise<SendTransactionResult> => {
                    return await this.thor.contracts.executeContractTransaction(
                        this.callerPrivateKey,
                        this.address,
                        this.getFunctionFragment(prop),
                        args,
                        this.contractTransactionOptions
                    );
                };
            }
        });
    }

    /**
     * Retrieves the function fragment for the specified function name.
     * @param prop - The name of the function.
     * @private
     * @throws An error if the specified function name or symbol is not found in the contract's ABI. The error includes
     * the `ERROR_CODES.ABI.INVALID_FUNCTION` code and a message indicating the function is not present in the ABI.
     *
     */
    private getFunctionFragment(prop: string | symbol): FunctionFragment {
        const functionFragment = coder
            .createInterface(this.abi)
            .getFunction(prop.toString());

        if (functionFragment == null) {
            throw buildError(
                ERROR_CODES.ABI.INVALID_FUNCTION,
                `Function '${prop.toString()}' not found in contract ABI`,
                { prop }
            );
        }
        return functionFragment;
    }
}

export { Contract };
