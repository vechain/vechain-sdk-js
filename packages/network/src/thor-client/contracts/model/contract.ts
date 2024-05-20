import {
    coder,
    type EventFragment,
    type FunctionFragment,
    type InterfaceAbi
} from '@vechain/sdk-core';
import type { TransactionReceipt } from '../../transactions';
import { type ThorClient } from '../../thor-client';
import type { ContractCallOptions, ContractTransactionOptions } from '../types';
import { buildError, ERROR_CODES } from '@vechain/sdk-errors';
import {
    type ContractFunctionClause,
    type ContractFunctionCriteria,
    type ContractFunctionFilter,
    type ContractFunctionRead,
    type ContractFunctionTransact
} from './types';
import {
    getClauseProxy,
    getCriteriaProxy,
    getFilterProxy,
    getReadProxy,
    getTransactProxy
} from './contract-proxy';
import { type VechainSigner } from '../../../signer';

/**
 * A class representing a smart contract deployed on the blockchain.
 */
class Contract {
    readonly thor: ThorClient;
    readonly address: string;
    readonly abi: InterfaceAbi;
    private signer?: VechainSigner;

    readonly deployTransactionReceipt: TransactionReceipt | undefined;

    public read: ContractFunctionRead = {};
    public transact: ContractFunctionTransact = {};
    public filters: ContractFunctionFilter = {};
    public clause: ContractFunctionClause = {};
    public criteria: ContractFunctionCriteria = {};

    private contractCallOptions: ContractCallOptions = {};
    private contractTransactionOptions: ContractTransactionOptions = {};

    /**
     * Initializes a new instance of the `Contract` class.
     * @param address The address of the contract.
     * @param abi The Application Binary Interface (ABI) of the contract, which defines the contract's methods and events.
     * @param thor An instance of ThorClient to interact with the blockchain.
     * @param signer The signer caller used for signing transactions.
     * @param transactionReceipt (Optional) The transaction receipt of the contract deployment.
     */
    constructor(
        address: string,
        abi: InterfaceAbi,
        thor: ThorClient,
        signer?: VechainSigner,
        transactionReceipt?: TransactionReceipt
    ) {
        this.abi = abi;
        this.thor = thor;
        this.address = address;
        this.deployTransactionReceipt = transactionReceipt;
        this.signer = signer;
        this.read = getReadProxy(this);
        this.transact = getTransactProxy(this);
        this.filters = getFilterProxy(this);
        this.clause = getClauseProxy(this);
        this.criteria = getCriteriaProxy(this);
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
        this.read = getReadProxy(this);
        return this.contractCallOptions;
    }

    /**
     * Clears the current contract call options, resetting them to an empty object.
     * @returns The updated contract call options.
     */
    public getContractReadOptions(): ContractCallOptions {
        return this.contractCallOptions;
    }

    /**
     * Clears the current contract call options, resetting them to an empty object.
     */
    public clearContractReadOptions(): void {
        this.contractCallOptions = {};
        this.read = getReadProxy(this);
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
        this.transact = getTransactProxy(this);
        return this.contractTransactionOptions;
    }

    /**
     * Retrieves the options for contract transactions.
     * @returns The contract transaction options.
     */
    public getContractTransactOptions(): ContractTransactionOptions {
        return this.contractTransactionOptions;
    }

    /**
     * Clears the current contract transaction options, resetting them to an empty object.
     */
    public clearContractTransactOptions(): void {
        this.contractTransactionOptions = {};
        this.transact = getTransactProxy(this);
    }

    /**
     * Sets the private key of the caller for signing transactions.
     * @param signer - The caller signer
     */
    public setSigner(signer: VechainSigner): VechainSigner {
        this.signer = signer;

        // initialize the proxy with the new signer
        this.transact = getTransactProxy(this);
        this.read = getReadProxy(this);
        return this.signer;
    }

    /**
     * Get the caller signer used for signing transactions.
     * @returns The signer used for signing transactions.
     */
    public getSigner(): VechainSigner | undefined {
        return this.signer;
    }

    /**
     * Retrieves the function fragment for the specified function name.
     * @param prop - The name of the function.
     * @private
     * @throws An error if the specified function name or symbol is not found in the contract's ABI. The error includes
     * the `ERROR_CODES.ABI.INVALID_FUNCTION` code and a message indicating the function is not present in the ABI.
     *
     */
    public getFunctionFragment(prop: string | symbol): FunctionFragment {
        const functionFragment = coder
            .createInterface(this.abi)
            .getFunction(prop.toString());

        if (functionFragment == null) {
            throw buildError(
                'Contract.getFunctionFragment',
                ERROR_CODES.ABI.INVALID_FUNCTION,
                `Function '${prop.toString()}' not found in contract ABI.`,
                { prop }
            );
        }
        return functionFragment;
    }

    /**
     * Retrieves the event fragment for the specified event name.
     * @param eventName - The name of the event.
     * @return The event fragment for the specified event name.
     */
    public getEventFragment(eventName: string | symbol): EventFragment {
        const eventFragment = coder
            .createInterface(this.abi)
            .getEvent(eventName.toString());

        if (eventFragment == null) {
            throw buildError(
                'Contract.getFunctionFragment',
                ERROR_CODES.ABI.INVALID_FUNCTION,
                `Function '${eventName.toString()}' not found in contract ABI.`,
                { eventName }
            );
        }
        return eventFragment;
    }
}

export { Contract };
