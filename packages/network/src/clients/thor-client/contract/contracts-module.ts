import {
    type AccountInputOptions,
    AccountsClient,
    TransactionsClient,
    type TransactionSendResult
} from '../../thorest-client';
import type { HttpClient } from '../../../utils';
import {
    buildDeployContractTransaction,
    type TransactionBodyOverride,
    TransactionHandler
} from '@vechainfoundation/vechain-sdk-core';

class ContractsModule {
    private readonly transactionsClient: TransactionsClient;
    private readonly accountsClient: AccountsClient;

    constructor(readonly httpClient: HttpClient) {
        this.transactionsClient = new TransactionsClient(httpClient);
        this.accountsClient = new AccountsClient(httpClient);
    }

    /**
     * Deploys a smart contract to the blockchain.
     *
     * @param contractBytecode - The bytecode of the smart contract to be deployed.
     * @param privateKey - The private key of the account deploying the smart contract.
     * @param transactionBodyOverride - (Optional) An object to override the default transaction body.
     * @returns A promise that resolves to a `TransactionSendResult` object representing the result of the deployment.
     */
    public async deployContract(
        contractBytecode: string,
        privateKey: string,
        transactionBodyOverride?: TransactionBodyOverride
    ): Promise<TransactionSendResult> {
        // Build a transaction for deploying the smart contract
        const transaction = buildDeployContractTransaction(
            contractBytecode,
            transactionBodyOverride
        );

        // Sign the transaction with the provided private key
        const rawSigned = TransactionHandler.sign(
            transaction,
            Buffer.from(privateKey, 'hex')
        ).encoded;

        // Send the signed transaction to the blockchain
        return await this.transactionsClient.sendTransaction(
            `0x${rawSigned.toString('hex')}`
        );
    }

    /**
     * Retrieves the bytecode of a deployed smart contract.
     *
     * @param contractAddress - The address of the deployed smart contract.
     * @param revision - The block number or ID to reference the bytecode version.
     * @returns A promise that resolves to a string representing the bytecode of the deployed smart contract.
     */
    public async getContractBytecode(
        contractAddress: string,
        revision?: string
    ): Promise<string> {
        const accountInfoOptions: AccountInputOptions = { revision };

        // Retrieve the bytecode of the smart contract from the blockchain
        return await this.accountsClient.getBytecode(
            contractAddress,
            accountInfoOptions
        );
    }
}

export { ContractsModule };
