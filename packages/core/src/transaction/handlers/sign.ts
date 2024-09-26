import { Address } from '../../vcdm/Address';
import { Secp256k1 } from '../../secp256k1';
import { Transaction } from '../Transaction';
import {
    InvalidSecp256k1PrivateKey,
    InvalidTransactionField,
    NotDelegatedTransaction
} from '@vechain/sdk-errors';
import { type TransactionBody } from '../TransactionBody';
import * as nc_utils from '@noble/curves/abstract/utils';

function sign(
    transactionBody: TransactionBody,
    signerPrivateKey: Uint8Array
): Transaction {
    // Check if the private key is valid.
    if (Secp256k1.isValidPrivateKey(signerPrivateKey)) {
        const transactionToSign = Transaction.of(transactionBody);
        if (!transactionToSign.isDelegated) {
            // Sign transaction
            const signature = Secp256k1.sign(
                transactionToSign.getSignatureHash().bytes,
                signerPrivateKey
            );
            // Return new signed transaction.
            return Transaction.of(transactionBody, signature);
        }
        throw new InvalidTransactionField(
            `Transaction.sign`,
            'delegated transaction: use signWithDelegator method',
            { fieldName: 'delegator', transactionBody }
        );
    }
    throw new InvalidSecp256k1PrivateKey(
        `Transaction.sign`,
        'invalid private key: ensure it is a secp256k1 key',
        undefined
    );
}

/**
 * Sign a transaction with a given private key
 *
 * @param transactionBody - The body of the transaction to sign
 * @param signerPrivateKey - Private key used to sign the transaction
 * @returns Signed transaction
 * @throws {InvalidSecp256k1PrivateKey, InvalidTransactionField}
 */

/**
 * Sign a transaction with signer and delegator private keys
 *
 * @param transactionBody - The body of the transaction to sign
 * @param signerPrivateKey - Signer private key (the origin)
 * @param delegatorPrivateKey - Delegate private key (the delegator)
 * @returns Signed transaction
 * @throws {InvalidSecp256k1PrivateKey}
 */
function signWithDelegator(
    transactionBody: TransactionBody,
    signerPrivateKey: Uint8Array,
    delegatorPrivateKey: Uint8Array
): Transaction {
    // Check if the private key of the signer is valid.
    if (Secp256k1.isValidPrivateKey(signerPrivateKey)) {
        // Check if the private key of the delegator is valid.
        if (Secp256k1.isValidPrivateKey(delegatorPrivateKey)) {
            const transactionToSign = Transaction.of(transactionBody);
            if (transactionToSign.isDelegated) {
                const transactionHash = transactionToSign.getSignatureHash();
                const delegatedHash = transactionToSign.getSignatureHash(
                    Address.ofPublicKey(
                        Secp256k1.derivePublicKey(signerPrivateKey)
                    )
                );
                // Return new signed transaction
                return Transaction.of(
                    transactionBody,
                    nc_utils.concatBytes(
                        Secp256k1.sign(transactionHash.bytes, signerPrivateKey),
                        Secp256k1.sign(delegatedHash.bytes, delegatorPrivateKey)
                    )
                );
            }
            throw new NotDelegatedTransaction(
                'Transaction.signWithDelegator',
                'not delegated transaction: use sign method',
                undefined
            );
        }
        throw new InvalidSecp256k1PrivateKey(
            `Transaction.signWithDelegator`,
            'invalid delegator private: ensure it is a secp256k1 key',
            undefined
        );
    }
    throw new InvalidSecp256k1PrivateKey(
        `Transaction.signWithDelegator`,
        'invalid signer private key: ensure it is a secp256k1 key',
        undefined
    );
}

function _signWithDelegator(
    transactionBody: TransactionBody,
    signerPrivateKey: Buffer,
    delegatorPrivateKey: Buffer
): Transaction {
    // Invalid private keys (signer and delegator)

    // Check if the private key of the signer is valid
    if (!Secp256k1.isValidPrivateKey(signerPrivateKey)) {
        throw new InvalidSecp256k1PrivateKey(
            `TransactionHandler.signWithDelegator()`,
            "Invalid signer private key used to sign the transaction. Ensure it's a valid secp256k1 private key.",
            undefined
        );
    }
    // Check if the private key of the delegator is valid
    if (!Secp256k1.isValidPrivateKey(delegatorPrivateKey)) {
        throw new InvalidSecp256k1PrivateKey(
            `TransactionHandler.signWithDelegator()`,
            "Invalid delegator private key used to sign the transaction. Ensure it's a valid secp256k1 private key.",
            undefined
        );
    }

    const transactionToSign = Transaction.of(transactionBody);

    // Transaction is not delegated
    if (!transactionToSign.isDelegated)
        throw new NotDelegatedTransaction(
            'signWithDelegator()',
            "Transaction is not delegated. Use 'sign()' method instead.",
            undefined
        );

    const transactionHash = transactionToSign.getSignatureHash();
    const delegatedHash = transactionToSign.getSignatureHash(
        Address.ofPublicKey(Secp256k1.derivePublicKey(signerPrivateKey))
    );
    const signature = Buffer.concat([
        Secp256k1.sign(transactionHash.bytes, signerPrivateKey),
        Secp256k1.sign(delegatedHash.bytes, delegatorPrivateKey)
    ]);

    // Return new signed transaction
    return Transaction.of(transactionBody, signature);
}

export { sign, signWithDelegator };
