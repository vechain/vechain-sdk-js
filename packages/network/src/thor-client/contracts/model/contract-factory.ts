import {
    addressUtils,
    contract,
    type DeployParams,
    type InterfaceAbi
} from '@vechain/vechain-sdk-core';
import type { ContractTransactionOptions } from '../types';
import { type ThorClient } from '../../thor-client';
import { Contract } from './contract';
import { assert, buildError, ERROR_CODES } from '@vechain/vechain-sdk-errors';
import {
    type SendTransactionResult,
    type TransactionReceipt
} from '../../transactions';

/**
 * A factory class for deploying smart contracts to a blockchain using a ThorClient.
 */
class ContractFactory {
    /**
     * The ABI (Application Binary Interface) of the contract.
     */
    private readonly abi: InterfaceAbi;

    /**
     * The bytecode of the smart contract.
     */
    private readonly bytecode: string;

    /**
     * The private key used for signing transactions.
     */
    private readonly privateKey: string;

    /**
     * An instance of ThorClient to interact with the blockchain.
     */
    private readonly thor: ThorClient;

    /**
     * The result of the deploy transaction, undefined until a deployment is started.
     */
    private deployTransactionResult: SendTransactionResult | undefined;

    constructor(
        abi: InterfaceAbi,
        bytecode: string,
        privateKey: string,
        thor: ThorClient
    ) {
        this.abi = abi;
        this.bytecode = bytecode;
        this.privateKey = privateKey;
        this.thor = thor;
    }

    /**
     * Initiates the deployment of a smart contract.
     *
     * This method performs several steps to deploy a smart contract:
     * 1. Builds a transaction clause for deploying the contract.
     * 2. Estimates the gas cost required for the transaction.
     * 3. Constructs the transaction body with the estimated gas cost.
     * 4. Signs the transaction using the provided private key.
     * 5. Sends the signed transaction to the blockchain.
     *
     * @param {DeployParams?} deployParams - Optional parameters for contract deployment.
     * @param {ContractTransactionOptions?} options - Optional transaction options, such as gas limit.
     * @returns {Promise<ContractFactory>} A promise that resolves to the instance of `ContractFactory`,
     *          allowing for fluent chaining of further actions or queries.
     * @throws {Error} Throws an error if any step in the deployment process fails.
     */
    public async startDeployment(
        deployParams?: DeployParams,
        options?: ContractTransactionOptions
    ): Promise<ContractFactory> {
        // Build a transaction for deploying the smart contract
        const deployContractClause = contract.clauseBuilder.deployContract(
            this.bytecode,
            deployParams
        );

        // Estimate the gas cost of the transaction
        const gasResult = await this.thor.gas.estimateGas(
            [deployContractClause],
            addressUtils.fromPrivateKey(Buffer.from(this.privateKey, 'hex'))
        );

        const txBody = await this.thor.transactions.buildTransactionBody(
            [deployContractClause],
            gasResult.totalGas,
            options
        );

        // Sign the transaction with the provided private key
        const signedTx = await this.thor.transactions.signTransaction(
            txBody,
            this.privateKey
        );

        // Send the signed transaction to the blockchain
        this.deployTransactionResult =
            await this.thor.transactions.sendTransaction(signedTx);

        return this;
    }

    /**
     * Waits for the completion of a contract deployment transaction.
     *
     * This method checks for the presence of a deploy transaction result and then
     * waits for the transaction to be processed. Upon successful processing, it
     * constructs and returns a new `Contract` instance based on the transaction receipt.
     *
     * @throws An error if the deploy transaction result is not found or if the
     *         contract deployment fails.
     * @returns {Promise<Contract>} A promise that resolves to a `Contract` instance
     *          once the deployment transaction is completed.
     */
    public async waitForDeployment(): Promise<Contract> {
        // Check if the deploy transaction result is available
        if (this.deployTransactionResult === undefined) {
            throw buildError(
                ERROR_CODES.CONTRACT.CONTRACT_DEPLOYMENT_FAILED,
                'Cannot find a contract deployment transaction.',
                { deployTransactionResult: this.deployTransactionResult }
            );
        }

        // Wait for the transaction to be processed
        const transactionReceipt =
            await this.thor.transactions.waitForTransaction(
                this.deployTransactionResult.id
            );

        // Ensure that the transaction receipt is valid
        assert(
            transactionReceipt !== undefined && transactionReceipt !== null,
            ERROR_CODES.CONTRACT.CONTRACT_DEPLOYMENT_FAILED,
            'Cannot deployment failed.',
            { deployTransactionResult: this.deployTransactionResult }
        );

        // Construct and return a new Contract instance
        return new Contract(
            this.abi,
            this.thor,
            transactionReceipt as TransactionReceipt
        );
    }
}

export { ContractFactory };
