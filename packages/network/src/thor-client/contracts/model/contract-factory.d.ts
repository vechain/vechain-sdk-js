import { type DeployParams } from '@vechain/sdk-core';
import { type Abi } from 'abitype';
import { type VeChainSigner } from '../../../signer';
import { type SendTransactionResult } from '../../transactions/types';
import type { ContractTransactionOptions } from '../types';
import { Contract } from './contract';
import { type ContractsModule } from '../contracts-module';
/**
 * A factory class for deploying smart contracts to a blockchain using a ThorClient.
 */
declare class ContractFactory<TAbi extends Abi> {
    /**
     * The ABI (Application Binary Interface) of the contract.
     */
    private readonly abi;
    /**
     * The bytecode of the smart contract.
     */
    private readonly bytecode;
    /**
     * The signer used for signing transactions.
     */
    private readonly signer;
    /**
     * The result of the deployment transaction, undefined until a deployment is started.
     */
    private deployTransaction;
    readonly contractsModule: ContractsModule;
    /**
     * Initializes a new instance of the `ContractFactory` class.
     * @param abi The Application Binary Interface (ABI) of the contract, which defines the contract's methods and events.
     * @param bytecode The compiled bytecode of the contract, representing the contract's executable code.
     * @param signer The signer used for signing transactions during contract deployment, ensuring the deployer's identity.
     * @param contractsModule An instance of the module to interact with the blockchain.
     */
    constructor(abi: Abi, bytecode: string, signer: VeChainSigner, contractsModule: ContractsModule);
    /**
     * Initiates the deployment of a smart contract.
     *
     * This method performs several steps to deploy a smart contract:
     * 1. Builds a transaction clause for deploying the contract.
     * 2. Estimates the gas cost required for the transaction.
     * 3. Constructs the transaction body with the estimated gas cost.
     * 4. Signs the transaction using the provided signer.
     * 5. Sends the signed transaction to the blockchain.
     *
     * @param {DeployParams?} deployParams (Optional) parameters for contract deployment.
     * @param {ContractTransactionOptions?} options (Optional) transaction options, such as gas limit.
     * @returns {Promise<ContractFactory>} A promise that resolves to the instance of `ContractFactory`,
     *          allowing for fluent chaining of further actions or queries.
     * @throws {Error} Throws an error if any step in the deployment process fails.
     */
    startDeployment(deployParams?: DeployParams, options?: ContractTransactionOptions): Promise<ContractFactory<TAbi>>;
    /**
     * Waits for the completion of a contract deployment transaction.
     *
     * This method checks for the presence of a deployed transaction result and then
     * waits for the transaction to be processed. Upon successful processing, it
     * constructs and returns a new `Contract` instance based on the transaction receipt.
     *
     * @returns {Promise<Contract>} A promise that resolves to a `Contract` instance
     *          once the deployment transaction is completed.
     * @throws {CannotFindTransaction, ContractDeploymentFailed}
     */
    waitForDeployment(): Promise<Contract<TAbi>>;
    /**
     * Returns the deploy transaction result, if available.
     */
    getDeployTransaction(): SendTransactionResult | undefined;
}
export { ContractFactory };
//# sourceMappingURL=contract-factory.d.ts.map