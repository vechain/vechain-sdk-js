import { addressUtils, type InterfaceAbi } from '@vechain/vechain-sdk-core';
import type {
    SendTransactionResult,
    TransactionReceipt
} from '../../transactions';
import { type ThorClient } from '../../thor-client';
import {
    type ContractCallOptions,
    type ContractTransactionOptions
} from '../types';

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
    readonly callerPrivateKey: string;

    readonly deployTransactionReceipt: TransactionReceipt | undefined;

    public readonly read: ContractFunctionRead = {};
    public readonly transact: ContractFunctionTransact = {};

    private contractCallOptions: ContractCallOptions = {};
    private contractTransactionOptions: ContractTransactionOptions = {};

    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents

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
        this.read = new Proxy(this.read, {
            get: (target, prop) => {
                // Otherwise, assume that the function is a contract method
                return async (...args: unknown[]) => {
                    return await this.thor.contracts.executeContractCall(
                        this.address,
                        this.abi,
                        prop.toString(),
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

        this.transact = new Proxy(this.transact, {
            get: (target, prop) => {
                // Otherwise, assume that the function is a contract method
                return async (
                    ...args: unknown[]
                ): Promise<SendTransactionResult> => {
                    return await this.thor.contracts.executeContractTransaction(
                        this.callerPrivateKey,
                        this.address,
                        this.abi,
                        prop.toString(),
                        args,
                        this.contractTransactionOptions
                    );
                };
            }
        });
    }

    public setContractCallOptions(
        options: ContractCallOptions
    ): ContractCallOptions {
        this.contractCallOptions = options;
        return this.contractCallOptions;
    }

    public clearContractCallOptions(): void {
        this.contractCallOptions = {};
    }

    public setContractTransactionOptions(
        options: ContractTransactionOptions
    ): ContractTransactionOptions {
        this.contractTransactionOptions = options;
        return this.contractTransactionOptions;
    }

    public clearContractTransactionOptions(): void {
        this.contractTransactionOptions = {};
    }
}

export { Contract };
