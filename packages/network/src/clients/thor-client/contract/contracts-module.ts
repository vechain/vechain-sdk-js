import {
    TransactionsClient,
    type TransactionSendResult
} from '../../thorest-client/transactions';
import type { HttpClient } from '../../../utils';
import {
    buildDeployContractTransaction,
    type TransactionBodyOverride,
    TransactionHandler
} from '@vechainfoundation/vechain-sdk-core';

class ContractsModule {
    private readonly transactionClient: TransactionsClient;

    constructor(readonly httpClient: HttpClient) {
        this.transactionClient = new TransactionsClient(httpClient);
    }

    public async deployContract(
        contractBytecode: string,
        privateKey: string,
        transactionBodyOverride?: TransactionBodyOverride
    ): Promise<TransactionSendResult> {
        const transaction = buildDeployContractTransaction(
            contractBytecode,
            transactionBodyOverride
        );
        const rawSigned = TransactionHandler.sign(
            transaction,
            Buffer.from(privateKey, 'hex')
        ).encoded;

        return await this.transactionClient.sendTransaction(
            `0x${rawSigned.toString('hex')}`
        );
    }
}

export { ContractsModule };
