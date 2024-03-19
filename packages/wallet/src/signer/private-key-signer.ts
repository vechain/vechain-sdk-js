import {
    // type SignTransactionOptions,
    type ThorClient
} from '@vechain/sdk-network';
import type {
    ExtendedClause,
    WalletInterface,
    SendTxOptions,
    SendTxResponse,
    AddWalletFn,
    CertificateRequest,
    CertificateOptions,
    CertificateResponse
} from '../wallets/types';
import {
    type Transaction,
    type TransactionBody,
    addressUtils,
    certificate,
    type Certificate,
    secp256k1,
    TransactionHandler,
    blake2b256
} from '@vechain/sdk-core';
import { assertTransactionCanBeSigned } from '@vechain/sdk-network/src/assertions';

class PrivateKeySigner implements WalletInterface {
    private readonly address: string;

    constructor(
        private readonly client: ThorClient,
        private readonly privateKey: Buffer
    ) {
        this.address = addressUtils.fromPrivateKey(privateKey);
    }

    static create: AddWalletFn = (client: ThorClient) => {
        const privateKey = secp256k1.generatePrivateKey();
        return new PrivateKeySigner(client, privateKey);
    };

    public sendTransaction = async (
        clauses: ExtendedClause[],
        options?: SendTxOptions | undefined
    ): Promise<SendTxResponse> => {
        const gas = await this.client.gas.estimateGas(clauses, this.address);

        const txBody = await this.client.transactions.buildTransactionBody(
            clauses,
            gas.totalGas
        );

        if (options?.gas != null && options.gas < gas.totalGas) {
            throw new Error('Insufficient gas');
        }

        const signedTx = this.signTransaction(
            txBody,
            this.privateKey.toString('hex')
            // { delegatorUrl: options?.delegator?.url }
        );

        const response = await this.client.transactions.sendTransaction(
            signedTx
            // options
        );

        return {
            id: response.id,
            signer: this.address
        };
    };

    /**
     * Signs a transaction with the given private key and handles the delegation if the transaction is delegated.
     * If the transaction is delegated, the signature of the delegator is retrieved from the delegator endpoint or from the delegator private key.
     *
     * @see [Simple Gas Payer Standard](https://docs.vechain.org/core-concepts/transactions/meta-transaction-features/fee-delegation/designated-gas-payer-vip-191) - Designated Gas Payer (VIP-191)
     *
     * @param txBody - The transaction body to sign.
     * @param privateKey - The private key of the origin account.
     * @param delegatorOptions - Optional parameters for the request. Includes the `delegatorUrl` and `delegatorPrivateKey` fields.
     *                  Only one of the following options can be specified: `delegatorUrl`, `delegatorPrivateKey`.
     *
     * @returns A promise that resolves to the signed transaction.
     */
    private signTransaction(
        txBody: TransactionBody,
        privateKey: string
        // delegatorOptions?: SignTransactionOptions
    ): Transaction {
        const originPrivateKey = Buffer.from(privateKey, 'hex');

        // Check if the transaction can be signed
        assertTransactionCanBeSigned(
            'signTransaction',
            originPrivateKey,
            txBody
        );

        // Check if the transaction is delegated - TO BE COMPLETED
        return TransactionHandler.sign(txBody, originPrivateKey);
    }

    public signCertificate = async (
        request: CertificateRequest,
        options?: CertificateOptions
    ): Promise<CertificateResponse> => {
        if (options?.signer != null && options.signer !== this.address) {
            throw new Error('Invalid signer');
        }

        const cert: Certificate = {
            ...request,
            signer: this.address,
            domain: 'https://example.org',
            timestamp: Date.now() / 1000
        };

        const signature = secp256k1.sign(
            blake2b256(certificate.encode(cert)),
            this.privateKey
        );

        cert.signature = signature.toString('hex');

        certificate.verify(cert);

        return await Promise.resolve({
            annex: {
                domain: cert.domain,
                timestamp: cert.timestamp,
                signer: this.address
            },
            signature: cert.signature
        });
    };
}

export { PrivateKeySigner };
