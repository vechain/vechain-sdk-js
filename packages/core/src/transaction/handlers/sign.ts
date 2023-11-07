import { addressUtils } from '../../address';
import { secp256k1 } from '../../secp256k1';
import { Transaction } from '../transaction';
import { buildError, SECP256K1, TRANSACTION } from '@vechain-sdk/errors';

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
    if (!secp256k1.isValidPrivateKey(signerPrivateKey))
        throw buildError(
            SECP256K1.INVALID_SECP256k1_PRIVATE_KEY,
            'Invalid private key used to sign the transaction.'
        );

    // Transaction is already signed
    if (transactionToSign.isSigned)
        throw buildError(
            TRANSACTION.ALREADY_SIGNED,
            'Cannot sign Transaction. It is already signed.'
        );

    // Transaction is delegated
    if (transactionToSign.isDelegated)
        throw buildError(
            TRANSACTION.INVALID_DELEGATION,
            'Transaction is already delegated. Use signWithDelegator method instead.'
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
    // Invalid private keys
    if (!secp256k1.isValidPrivateKey(signerPrivateKey))
        throw buildError(
            SECP256K1.INVALID_SECP256k1_PRIVATE_KEY,
            'Invalid signer private key used to sign the transaction.'
        );
    if (!secp256k1.isValidPrivateKey(delegatorPrivateKey))
        throw buildError(
            SECP256K1.INVALID_SECP256k1_PRIVATE_KEY,
            'Invalid delegator private key used to sign the transaction.'
        );

    // Transaction is already signed
    if (transactionToSign.isSigned)
        throw buildError(
            TRANSACTION.ALREADY_SIGNED,
            'Transaction is already signed.'
        );

    // Transaction is not delegated
    if (!transactionToSign.isDelegated)
        throw buildError(
            TRANSACTION.INVALID_DELEGATION,
            'Transaction is not delegated. You are using the wrong method. Use sign method instead.'
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
