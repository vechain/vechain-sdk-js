import {
    clauseBuilder,
    type DeployParams,
    type InterfaceAbi,
    TransactionHandler
} from '@vechain/sdk-core';
import type { ContractTransactionOptions } from '../types';
import { type ThorClient } from '../../thor-client';
import { Contract } from './contract';
import {
    CannotFindTransaction,
    ContractDeploymentFailed
} from '@vechain/sdk-errors';
import { type SendTransactionResult } from '../../transactions';
import { signerUtils, type VeChainSigner } from '../../../signer';
import { type Abi } from 'abitype';

/**
 * A factory class for deploying smart contracts to a blockchain using a ThorClient.
 */
class ContractFactory<TAbi extends Abi> {
    /**
     * The ABI (Application Binary Interface) of the contract.
     */
    private readonly abi: InterfaceAbi;

    /**
     * The bytecode of the smart contract.
     */
    private readonly bytecode: string;

    /**
     * The signer used for signing transactions.
     */
    private readonly signer: VeChainSigner;

    /**
     * An instance of ThorClient to interact with the blockchain.
     */
    private readonly thor: ThorClient;

    /**
     * The result of the deployment transaction, undefined until a deployment is started.
     */
    private deployTransaction: SendTransactionResult | undefined;

    /**
     * Initializes a new instance of the `ContractFactory` class.
     * @param abi The Application Binary Interface (ABI) of the contract, which defines the contract's methods and events.
     * @param bytecode The compiled bytecode of the contract, representing the contract's executable code.
     * @param signer The signer used for signing transactions during contract deployment, ensuring the deployer's identity.
     * @param thor An instance of ThorClient to interact with the blockchain.
     */
    constructor(
        abi: InterfaceAbi,
        bytecode: string,
        signer: VeChainSigner,
        thor: ThorClient
    ) {
        this.abi = abi;
        this.bytecode = bytecode;
        this.signer = signer;
        this.thor = thor;
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
        const deployContractClause = clauseBuilder.deployContract(
            this.bytecode,
            deployParams
        );

        // Estimate the gas cost of the transaction
        const gasResult = await this.thor.gas.estimateGas(
            [deployContractClause],
            await this.signer.getAddress()
        );

        const txBody = await this.thor.transactions.buildTransactionBody(
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
        this.deployTransaction = await this.thor.transactions.sendTransaction(
            TransactionHandler.decode(
                Buffer.from(signedTx.slice(2), 'hex'),
                true
            )
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
                    networkUrl: this.thor.httpClient.baseURL
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
            this.thor,
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
