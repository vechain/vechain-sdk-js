import { addressUtils } from '../../address';
import { secp256k1 } from '../../secp256k1';
import { Transaction } from '../transaction';
import { assert, TRANSACTION } from '@vechain/sdk-errors';
import { type TransactionBody } from '../types';
import { assertIsValidTransactionSigningPrivateKey } from '../../assertions';

/**
 * Sign a transaction with a given private key
 *
 * @throws{InvalidSecp256k1PrivateKeyError, TransactionAlreadySignedError, TransactionDelegationError}
 * @param transactionBody - The body of the transaction to sign
 * @param signerPrivateKey - Private key used to sign the transaction
 * @returns Signed transaction
 */
function sign(
    transactionBody: TransactionBody,
    signerPrivateKey: Buffer
): Transaction {
    // Invalid private key
    assertIsValidTransactionSigningPrivateKey(
        'sign',
        signerPrivateKey,
        secp256k1.isValidPrivateKey
    );

    const transactionToSign = new Transaction(transactionBody);

    // Transaction is delegated
    assert(
        'sign',
        !transactionToSign.isDelegated,
        TRANSACTION.INVALID_DELEGATION,
        'Transaction is delegated. Use signWithDelegator method instead.',
        { transactionBody }
    );

    // Sign transaction
    const signature = secp256k1.sign(
        transactionToSign.getSignatureHash(),
        signerPrivateKey
    );

    // Return new signed transaction
    return new Transaction(transactionBody, Buffer.from(signature));
}

/**
 * Sign a transaction with signer and delegator private keys
 *
 * @throws{InvalidSecp256k1PrivateKeyError, TransactionAlreadySignedError, TransactionDelegationError}
 * @param transactionBody - The body of the transaction to sign
 * @param signerPrivateKey - Signer private key (the origin)
 * @param delegatorPrivateKey - Delegate private key (the delegator)
 * @returns Signed transaction
 */
function signWithDelegator(
    transactionBody: TransactionBody,
    signerPrivateKey: Buffer,
    delegatorPrivateKey: Buffer
): Transaction {
    // Invalid private keys (signer and delegator)
    assertIsValidTransactionSigningPrivateKey(
        'signWithDelegator',
        signerPrivateKey,
        secp256k1.isValidPrivateKey,
        'signer'
    );
    assertIsValidTransactionSigningPrivateKey(
        'signWithDelgator',
        delegatorPrivateKey,
        secp256k1.isValidPrivateKey,
        'delegator'
    );

    const transactionToSign = new Transaction(transactionBody);

    // Transaction is not delegated
    assert(
        'signWithDelegator',
        transactionToSign.isDelegated,
        TRANSACTION.INVALID_DELEGATION,
        'Transaction is not delegated. Use sign method instead.',
        { transactionToSign }
    );

    const transactionHash = transactionToSign.getSignatureHash();
    const delegatedHash = transactionToSign.getSignatureHash(
        addressUtils.fromPublicKey(
            Buffer.from(secp256k1.derivePublicKey(signerPrivateKey))
        )
    );
    const signature = Buffer.concat([
        secp256k1.sign(transactionHash, signerPrivateKey),
        secp256k1.sign(delegatedHash, delegatorPrivateKey)
    ]);

    // Return new signed transaction
    return new Transaction(transactionBody, signature);
}

export { sign, signWithDelegator };
