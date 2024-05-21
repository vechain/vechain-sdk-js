import {
    clauseBuilder,
    type DeployParams,
    type InterfaceAbi
} from '@vechain/sdk-core';
import { type ThorClient } from '../../thor-client';
import { Contract } from './contract';
import { assert, buildError, ERROR_CODES } from '@vechain/sdk-errors';
import {
    type SendTransactionResult,
    type TransactionReceipt
} from '../../transactions';
import {
    type ContractRunner,
    type TransactionRequest,
    type TransactionResponse
} from 'ethers';

type VechainContractRunner = ContractRunner & {
    sendTransaction: (tx: TransactionRequest) => Promise<TransactionResponse>;
};

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
     * The signer used for signing transactions.
     */
    private readonly runner: VechainContractRunner;

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
        runner: VechainContractRunner,
        thor: ThorClient
    ) {
        if (runner.sendTransaction === undefined) {
            throw new Error(
                'ContractFactory requires a runner with sendTransaction'
            );
        }
        this.abi = abi;
        this.bytecode = bytecode;
        this.runner = runner;
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
        deployParams?: DeployParams
    ): Promise<ContractFactory> {
        const deployContractClause = clauseBuilder.deployContract(
            this.bytecode,
            deployParams
        );

        const txRes = await this.runner.sendTransaction({
            data: deployContractClause.data,
            value: deployContractClause.value
        });

        // Send the signed transaction to the blockchain
        this.deployTransaction = {
            id: txRes.hash,
            wait: async () => {
                return await this.thor.transactions.waitForTransaction(
                    txRes.hash
                );
            }
        };

        return this;
    }

    /**
     * Waits for the completion of a contract deployment transaction.
     *
     * This method checks for the presence of a deployed transaction result and then
     * waits for the transaction to be processed. Upon successful processing, it
     * constructs and returns a new `Contract` instance based on the transaction receipt.
     *
     * @throws An error if the deployed transaction result is not found or if the
     *         contract deployment fails.
     * @returns {Promise<Contract>} A promise that resolves to a `Contract` instance
     *          once the deployment transaction is completed.
     */
    public async waitForDeployment(): Promise<Contract> {
        // Check if the deploy transaction result is available
        if (this.deployTransaction === undefined) {
            throw buildError(
                'ContractFactory.waitForDeployment',
                ERROR_CODES.CONTRACT.CONTRACT_DEPLOYMENT_FAILED,
                'Cannot find a contract deployment transaction.',
                { deployTransaction: this.deployTransaction }
            );
        }

        // Wait for the transaction to be processed
        const transactionReceipt =
            await this.thor.transactions.waitForTransaction(
                this.deployTransaction.id
            );

        // Ensure that the transaction receipt is valid
        assert(
            'ContractFactory.waitForDeployment',
            transactionReceipt?.outputs[0]?.contractAddress !== null &&
                transactionReceipt?.outputs[0]?.contractAddress !== undefined,
            ERROR_CODES.CONTRACT.CONTRACT_DEPLOYMENT_FAILED,
            'Contract deployment failed.',
            { deployTransaction: this.deployTransaction }
        );

        // Construct and return a new Contract instance
        return new Contract(
            transactionReceipt?.outputs[0].contractAddress as string,
            this.abi,
            this.thor,
            this.signer,
            transactionReceipt as TransactionReceipt
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
