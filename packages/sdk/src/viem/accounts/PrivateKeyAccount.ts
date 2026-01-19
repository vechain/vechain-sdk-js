import { Address, type Hex } from '@common';
import { PrivateKeySigner } from '@thor/signer';
import { type TransactionRequest } from '@thor/thor-client/model/transactions';

/**
 * The interface represents a private key account.
 * It is used to sign transaction requests using a private key.
 * This mirrors the PrivateKeyAccount from viem, but adds the signAsGasPayer method & dispose method.
 */
export interface PrivateKeyAccount {
    address: Address;
    sign: (transactionRequest: TransactionRequest) => Promise<Hex>;
    signAsGasPayer: (
        sender: Address,
        transactionRequest: TransactionRequest
    ) => Promise<Hex>;
    dispose: () => void;
}
/**
 * Creates a private key account from a private key.
 * @param privateKey - The private key to create the account from.
 * @returns The private key account.
 */
export function privateKeyToAccount(privateKey: Hex): PrivateKeyAccount {
    const keyBytes = privateKey.bytes;
    const signer = new PrivateKeySigner(keyBytes);
    keyBytes.fill(0);
    const account: PrivateKeyAccount = {
        address: signer.address,
        sign: async (transactionRequest: TransactionRequest) => {
            const signedTx = await signer.sign(transactionRequest);
            return signedTx.encoded;
        },
        signAsGasPayer: async (
            sender: Address,
            transactionRequest: TransactionRequest
        ) => {
            const signedTx = await signer.sign(transactionRequest, sender);
            return signedTx.encoded;
        },
        dispose: () => {
            signer.dispose();
        }
    };
    return account;
}
