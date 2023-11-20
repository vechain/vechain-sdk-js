import { addressUtils } from '../../address';
import { secp256k1 } from '../../secp256k1';
import { Transaction } from '../transaction';
import {
    assertInput,
    SECP256K1,
    TRANSACTION
} from '@vechainfoundation/vechain-sdk-errors';

/**
 * Sign a transaction with a given private key
 *
 * @throws{InvalidSecp256k1PrivateKeyError, TransactionAlreadySignedError, TransactionDelegationError}
 * @param transactionToSign - Transaction to sign
 * @param signerPrivateKey - Private key used to sign the transaction
 * @returns Signed transaction
 */
function sign(
    transactionToSign: Transaction,
    signerPrivateKey: Buffer
): Transaction {
    // Invalid private key
    assertInput(
        secp256k1.isValidPrivateKey(signerPrivateKey),
        SECP256K1.INVALID_SECP256k1_PRIVATE_KEY,
        'Invalid private key used to sign the transaction.',
        { signerPrivateKey }
    );

    // Transaction is already signed
    assertInput(
        !transactionToSign.isSigned,
        TRANSACTION.ALREADY_SIGNED,
        'Cannot sign Transaction. It is already signed.',
        { transactionToSign }
    );

    // Transaction is delegated
    assertInput(
        !transactionToSign.isDelegated,
        TRANSACTION.INVALID_DELEGATION,
        'Transaction is delegated. Use signWithDelegator method instead.',
        { transactionToSign }
    );

    // Sign transaction
    const signature = secp256k1.sign(
        transactionToSign.getSignatureHash(),
        signerPrivateKey
    );

    // Return new signed transaction
    return new Transaction(transactionToSign.body, signature);
}

/**
 * Sign a transaction with signer and delegator private keys
 *
 * @throws{InvalidSecp256k1PrivateKeyError, TransactionAlreadySignedError, TransactionDelegationError}
 * @param transactionToSign - Transaction to sign
 * @param signerPrivateKey - Signer private key (the origin)
 * @param delegatorPrivateKey - Delegate private key (the delegator)
 * @returns Signed transaction
 */
function signWithDelegator(
    transactionToSign: Transaction,
    signerPrivateKey: Buffer,
    delegatorPrivateKey: Buffer
): Transaction {
    // Invalid private keys (signer and delegator)
    assertInput(
        secp256k1.isValidPrivateKey(signerPrivateKey),
        SECP256K1.INVALID_SECP256k1_PRIVATE_KEY,
        'Invalid signer private key used to sign the transaction.',
        { signerPrivateKey }
    );
    assertInput(
        secp256k1.isValidPrivateKey(delegatorPrivateKey),
        SECP256K1.INVALID_SECP256k1_PRIVATE_KEY,
        'Invalid delegator private key used to sign the transaction.',
        { delegatorPrivateKey }
    );

    // Transaction is already signed
    assertInput(
        !transactionToSign.isSigned,
        TRANSACTION.ALREADY_SIGNED,
        'Cannot sign Transaction. It is already signed.',
        { transactionToSign }
    );

    // Transaction is not delegated
    assertInput(
        transactionToSign.isDelegated,
        TRANSACTION.INVALID_DELEGATION,
        'Transaction is not delegated. You are using the wrong method. Use sign method instead.',
        { transactionToSign }
    );

    const transactionHash = transactionToSign.getSignatureHash();
    const delegatedHash = transactionToSign.getSignatureHash(
        addressUtils.fromPublicKey(secp256k1.derivePublicKey(signerPrivateKey))
    );
    const signature = Buffer.concat([
        secp256k1.sign(transactionHash, signerPrivateKey),
        secp256k1.sign(delegatedHash, delegatorPrivateKey)
    ]);

    // Return new signed transaction
    return new Transaction(transactionToSign.body, signature);
}

export { sign, signWithDelegator };
