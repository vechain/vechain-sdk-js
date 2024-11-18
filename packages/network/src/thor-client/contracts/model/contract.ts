import {
    ABIContract,
    type ABIEvent,
    type ABIFunction
} from '@vechain/sdk-core';
import {
    type Abi,
    type ExtractAbiEventNames,
    type ExtractAbiFunctionNames
} from 'abitype';
import { type VeChainSigner } from '../../../signer';
import type { TransactionReceipt } from '../../transactions/types';
import type { ContractCallOptions, ContractTransactionOptions } from '../types';
import {
    getClauseProxy,
    getCriteriaProxy,
    getFilterProxy,
    getReadProxy,
    getTransactProxy
} from './contract-proxy';
import {
    type ContractFunctionClause,
    type ContractFunctionCriteria,
    type ContractFunctionFilter,
    type ContractFunctionRead,
    type ContractFunctionTransact
} from './types';
import { type ContractsModule } from '../contracts-module';

/**
 * A class representing a smart contract deployed on the blockchain.
 */
class Contract<TAbi extends Abi> {
    readonly contractsModule: ContractsModule;
    readonly address: string;
    readonly abi: Abi;
    private signer?: VeChainSigner;

    readonly deployTransactionReceipt: TransactionReceipt | undefined;

    public read: ContractFunctionRead<
        TAbi,
        ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    > = {} as ContractFunctionRead<
        TAbi,
        ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>
    >;

    public transact: ContractFunctionTransact<
        TAbi,
        ExtractAbiFunctionNames<TAbi, 'payable' | 'nonpayable'>
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    > = {} as ContractFunctionTransact<
        TAbi,
        ExtractAbiFunctionNames<TAbi, 'payable' | 'nonpayable'>
    >;

    public filters: ContractFunctionFilter<TAbi, ExtractAbiEventNames<TAbi>> =
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        {} as ContractFunctionFilter<TAbi, ExtractAbiEventNames<TAbi>>;

    public clause: ContractFunctionClause<
        TAbi,
        ExtractAbiFunctionNames<TAbi>
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    > = {} as ContractFunctionClause<TAbi, ExtractAbiFunctionNames<TAbi>>;

    public criteria: ContractFunctionCriteria<
        TAbi,
        ExtractAbiEventNames<TAbi>
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    > = {} as ContractFunctionCriteria<TAbi, ExtractAbiEventNames<TAbi>>;

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
        abi: Abi,
        contractsModule: ContractsModule,
        signer?: VeChainSigner,
        transactionReceipt?: TransactionReceipt
    ) {
        this.abi = abi;
        this.address = address;
        this.contractsModule = contractsModule;
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
    public setSigner(signer: VeChainSigner): VeChainSigner {
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
    public getSigner(): VeChainSigner | undefined {
        return this.signer;
    }

    /**
     * Retrieves the function ABI for the specified function name.
     * @param prop - The name of the function.
     * @return The function ABI for the specified event name.
     * @throws {InvalidAbiItem}
     *
     */
    public getFunctionAbi(prop: string | symbol): ABIFunction {
        return ABIContract.ofAbi(this.abi).getFunction(prop.toString());
    }

    /**
     * Retrieves the event ABI for the specified event name.
     * @param eventName - The name of the event.
     * @return The event ABI for the specified event name.
     * @throws {InvalidAbiItem}
     */
    public getEventAbi(eventName: string | symbol): ABIEvent {
        return ABIContract.ofAbi(this.abi).getEvent(eventName.toString());
    }
}

export { Contract };
