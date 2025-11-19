import { type ABIEvent, type ABIFunction } from '@vechain/sdk-core';
import { type Abi, type ExtractAbiEventNames, type ExtractAbiFunctionNames } from 'abitype';
import { type VeChainSigner } from '../../../signer';
import type { TransactionReceipt } from '../../transactions/types';
import { type ContractsModule } from '../contracts-module';
import type { ContractCallOptions, ContractTransactionOptions } from '../types';
import { type ContractFunctionClause, type ContractFunctionCriteria, type ContractFunctionFilter, type ContractFunctionRead, type ContractFunctionTransact } from './types';
/**
 * A class representing a smart contract deployed on the blockchain.
 */
declare class Contract<TAbi extends Abi> {
    readonly contractsModule: ContractsModule;
    readonly address: string;
    readonly abi: Abi;
    private signer?;
    readonly deployTransactionReceipt: TransactionReceipt | undefined;
    read: ContractFunctionRead<TAbi, ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>>;
    transact: ContractFunctionTransact<TAbi, ExtractAbiFunctionNames<TAbi, 'payable' | 'nonpayable'>>;
    filters: ContractFunctionFilter<TAbi, ExtractAbiEventNames<TAbi>>;
    clause: ContractFunctionClause<TAbi, ExtractAbiFunctionNames<TAbi>>;
    criteria: ContractFunctionCriteria<TAbi, ExtractAbiEventNames<TAbi>>;
    private contractCallOptions;
    private contractTransactionOptions;
    /**
     * Initializes a new instance of the `Contract` class.
     * @param address The address of the contract.
     * @param abi The Application Binary Interface (ABI) of the contract, which defines the contract's methods and events.
     * @param thor An instance of ThorClient to interact with the blockchain.
     * @param signer The signer caller used for signing transactions.
     * @param transactionReceipt (Optional) The transaction receipt of the contract deployment.
     */
    constructor(address: string, abi: Abi, contractsModule: ContractsModule, signer?: VeChainSigner, transactionReceipt?: TransactionReceipt);
    /**
     * Sets the options for contract calls.
     * @param options - The contract call options to set.
     * @returns The updated contract call options.
     */
    setContractReadOptions(options: ContractCallOptions): ContractCallOptions;
    /**
     * Clears the current contract call options, resetting them to an empty object.
     * @returns The updated contract call options.
     */
    getContractReadOptions(): ContractCallOptions;
    /**
     * Clears the current contract call options, resetting them to an empty object.
     */
    clearContractReadOptions(): void;
    /**
     * Sets the options for contract transactions.
     * @param options - The contract transaction options to set.
     * @returns The updated contract transaction options.
     */
    setContractTransactOptions(options: ContractTransactionOptions): ContractTransactionOptions;
    /**
     * Retrieves the options for contract transactions.
     * @returns The contract transaction options.
     */
    getContractTransactOptions(): ContractTransactionOptions;
    /**
     * Clears the current contract transaction options, resetting them to an empty object.
     */
    clearContractTransactOptions(): void;
    /**
     * Sets the private key of the caller for signing transactions.
     * @param signer - The caller signer
     */
    setSigner(signer: VeChainSigner): VeChainSigner;
    /**
     * Get the caller signer used for signing transactions.
     * @returns The signer used for signing transactions.
     */
    getSigner(): VeChainSigner | undefined;
    /**
     * Retrieves the function ABI for the specified function name.
     * @param prop - The name of the function.
     * @return The function ABI for the specified event name.
     * @throws {InvalidAbiItem}
     *
     */
    getFunctionAbi(prop: string | symbol): ABIFunction;
    /**
     * Retrieves the event ABI for the specified event name.
     * @param eventName - The name of the event.
     * @return The event ABI for the specified event name.
     * @throws {InvalidAbiItem}
     */
    getEventAbi(eventName: string | symbol): ABIEvent;
}
export { Contract };
//# sourceMappingURL=contract.d.ts.map