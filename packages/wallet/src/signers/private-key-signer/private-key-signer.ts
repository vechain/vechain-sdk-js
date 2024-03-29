import { type ThorClient } from '@vechain/sdk-network';
import {
    type SendTxOptions,
    type ExtendedClause,
    type SendTxResponse,
    type Signer
} from '../types';
import { addressUtils, secp256k1, Transaction } from '@vechain/sdk-core';
import { buildError, ERROR_CODES } from '@vechain/sdk-errors';

class PrivateKeySigner implements Signer {
    private readonly privateKey: Buffer;
    private readonly address: string;
    private readonly client: ThorClient;

    constructor(client: ThorClient, privateKey: Buffer) {
        this.client = client;
        this.privateKey = privateKey;
        this.address = addressUtils.fromPrivateKey(privateKey);
    }

    public sendTransaction = async (
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
            throw buildError(
                'Contract.getTransactProxy',
                ERROR_CODES.TRANSACTION.MISSING_PRIVATE_KEY,
                'Insufficient gas.'
            );
        }

        const tx = new Transaction(txBody);

        const signedTx = new Transaction(
            tx.body,
            secp256k1.sign(tx.getSignatureHash(), this.privateKey)
        );

        const sendTxRes =
            await this.client.transactions.sendTransaction(signedTx);

        return {
            ...sendTxRes,
            signer: this.address
        };
    };
}

export { PrivateKeySigner };
