import { Address, type Hex } from '@common';
import { PrivateKeySigner } from '@thor/signer';
import { type TransactionRequest } from '@thor/thor-client/model/transactions';

/**
 * The interface represents a private key account.
 * It is used to sign transaction requests using a private key.
 * This mirrors the PrivateKeyAccount from viem, but adds the signAsGasPayer method.
 */
export interface PrivateKeyAccount {
    privateKey: Hex;
    address: Address;
    sign: (transactionRequest: TransactionRequest) => Hex;
    signAsGasPayer: (
        sender: Address,
        transactionRequest: TransactionRequest
    ) => Hex;
}
/**
 * Creates a private key account from a private key.
 * @param privateKey - The private key to create the account from.
 * @returns The private key account.
 */
export function privateKeyToAccount(privateKey: Hex): PrivateKeyAccount {
    const address = Address.ofPrivateKey(privateKey.bytes);
    const account: PrivateKeyAccount = {
        privateKey,
        address,
        sign: (transactionRequest: TransactionRequest) => {
            const signer = new PrivateKeySigner(privateKey.bytes);
            const signedTx = signer.sign(transactionRequest);
            return signedTx.encoded;
        },
        signAsGasPayer: (
            sender: Address,
            transactionRequest: TransactionRequest
        ) => {
            const signer = new PrivateKeySigner(privateKey.bytes);
            const signedTx = signer.sign(transactionRequest, sender);
            return signedTx.encoded;
        }
    };
    return account;
}
