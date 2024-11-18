import {
    Clause,
    HexUInt,
    Transaction,
    type DeployParams,
    type TransactionClause
} from '@vechain/sdk-core';
import {
    CannotFindTransaction,
    ContractDeploymentFailed
} from '@vechain/sdk-errors';
import { type Abi } from 'abitype';
import { signerUtils, type VeChainSigner } from '../../../signer';
import { type SendTransactionResult } from '../../transactions/types';
import type { ContractTransactionOptions } from '../types';
import { Contract } from './contract';
import { type ContractsModule } from '../contracts-module';

/**
 * A factory class for deploying smart contracts to a blockchain using a ThorClient.
 */
class ContractFactory<TAbi extends Abi> {
    /**
     * The ABI (Application Binary Interface) of the contract.
     */
    private readonly abi: Abi;

    /**
     * The bytecode of the smart contract.
     */
    private readonly bytecode: string;

    /**
     * The signer used for signing transactions.
     */
    private readonly signer: VeChainSigner;

    /**
     * The result of the deployment transaction, undefined until a deployment is started.
     */
    private deployTransaction: SendTransactionResult | undefined;

    readonly contractsModule: ContractsModule;

    /**
     * Initializes a new instance of the `ContractFactory` class.
     * @param abi The Application Binary Interface (ABI) of the contract, which defines the contract's methods and events.
     * @param bytecode The compiled bytecode of the contract, representing the contract's executable code.
     * @param signer The signer used for signing transactions during contract deployment, ensuring the deployer's identity.
     * @param contractsModule An instance of the module to interact with the blockchain.
     */
    constructor(
        abi: Abi,
        bytecode: string,
        signer: VeChainSigner,
        contractsModule: ContractsModule
    ) {
        this.abi = abi;
        this.bytecode = bytecode;
        this.signer = signer;
        this.contractsModule = contractsModule;
    }

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
    public async startDeployment(
        deployParams?: DeployParams,
        options?: ContractTransactionOptions
    ): Promise<ContractFactory<TAbi>> {
        // Build a transaction for deploying the smart contract

        const deployContractClause = Clause.deployContract(
            HexUInt.of(this.bytecode),
            deployParams
        ) as TransactionClause;

        // Estimate the gas cost of the transaction
        const gasResult =
            await this.contractsModule.transactionsModule.estimateGas(
                [deployContractClause],
                await this.signer.getAddress()
            );

        const txBody =
            await this.contractsModule.transactionsModule.buildTransactionBody(
                [deployContractClause],
                gasResult.totalGas,
                options
            );

        // Sign the transaction
        const signedTx = await this.signer.signTransaction(
            signerUtils.transactionBodyToTransactionRequestInput(
                txBody,
                await this.signer.getAddress()
            )
        );

        // Send the signed transaction to the blockchain
        this.deployTransaction =
            await this.contractsModule.transactionsModule.sendTransaction(
                Transaction.decode(HexUInt.of(signedTx.slice(2)).bytes, true)
            );

        return this;
    }

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
    public async waitForDeployment(): Promise<Contract<TAbi>> {
        // Check if the deploy transaction result is available
        if (this.deployTransaction?.id === undefined) {
            throw new CannotFindTransaction(
                'ContractFactory.waitForDeployment()',
                'Cannot find a contract deployment transaction',
                {
                    networkUrl:
                        this.contractsModule.transactionsModule.blocksModule
                            .httpClient.baseURL
                }
            );
        }

        // Wait for the transaction to be processed
        const transactionReceipt = await this.deployTransaction.wait();

        // Ensure that the transaction receipt is valid
        if (
            transactionReceipt?.outputs[0]?.contractAddress === null ||
            transactionReceipt?.outputs[0]?.contractAddress === undefined
        ) {
            throw new ContractDeploymentFailed(
                'ContractFactory.waitForDeployment()',
                'Contract deployment failed.',
                {
                    deployTransaction: this.deployTransaction
                }
            );
        }

        // Construct and return a new Contract instance
        return new Contract<TAbi>(
            transactionReceipt?.outputs[0].contractAddress,
            this.abi,
            this.contractsModule,
            this.signer,
            transactionReceipt
        );
    }

    /**
     * Returns the deploy transaction result, if available.
     */
    public getDeployTransaction(): SendTransactionResult | undefined {
        return this.deployTransaction;
    }
}

export { ContractFactory };
