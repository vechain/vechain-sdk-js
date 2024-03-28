import { type ThorClient } from '@vechain/sdk-network';
import {
    type SendTxOptions,
    type ExtendedClause,
    type SendTxResponse,
    type TransactionSender
} from './types';
import { addressUtils, secp256k1, Transaction } from '@vechain/sdk-core';

class PrivateKeySigner implements TransactionSender {
    private readonly privateKey: Buffer;
    private readonly address: string;
    private readonly client: ThorClient;

    constructor(client: ThorClient, privateKey: Buffer) {
        this.client = client;
        this.privateKey = privateKey;
        this.address = addressUtils.fromPrivateKey(privateKey);
    }

    static new = (client: ThorClient, privateKey: Buffer): PrivateKeySigner => {
        return new PrivateKeySigner(client, privateKey);
    };

    public sendTransaction: TransactionSender['sendTransaction'] = async (
        clauses: ExtendedClause[],
        options?: SendTxOptions | undefined
    ): Promise<SendTxResponse> => {
        const gas = await this.client.gas.estimateGas(clauses, this.address);

        const txBody = await this.client.transactions.buildTransactionBody(
            clauses,
            gas.totalGas,
            options
        );

        if (options?.gas != null && options.gas < gas.totalGas) {
            throw new Error('Insufficient gas');
        }

        const tx = new Transaction(txBody);

        const signedTx = new Transaction(
            tx.body,
            secp256k1.sign(tx.getSignatureHash(), this.privateKey)
        );

        const sendTxRes =
            await this.client.transactions.sendTransaction(signedTx);

        sendTxRes.wait = async () => {
            return await this.client.transactions.waitForTransaction(
                sendTxRes.id
            );
        };

        return {
            ...sendTxRes,
            signer: this.address
        };
    };
}

export { PrivateKeySigner };
