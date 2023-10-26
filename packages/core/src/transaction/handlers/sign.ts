import { address } from '../../address';
import { secp256k1 } from '../../secp256k1';
import { ERRORS } from '../../utils';
import { Transaction } from '../transaction';

/**
 * Sign a transaction with a given private key
 *
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
        throw new Error(ERRORS.TRANSACTION.INVALID_SIGNATURE_PRIVATE_KEY);

    // Transaction is already signed
    if (transactionToSign.isSigned)
        throw new Error(ERRORS.TRANSACTION.ALREADY_SIGN);

    // Transaction is delegated
    if (transactionToSign.isDelegated)
        throw new Error(ERRORS.TRANSACTION.DELEGATED);

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
    // @note we will improve error messages in the future!
    // Invalid private key
    if (
        !secp256k1.isValidPrivateKey(signerPrivateKey) ||
        !secp256k1.isValidPrivateKey(delegatorPrivateKey)
    )
        throw new Error(ERRORS.TRANSACTION.INVALID_SIGNATURE_PRIVATE_KEY);

    // Transaction is already signed
    if (transactionToSign.isSigned)
        throw new Error(ERRORS.TRANSACTION.ALREADY_SIGN);

    // Transaction is not delegated
    if (!transactionToSign.isDelegated)
        throw new Error(ERRORS.TRANSACTION.NOT_DELEGATED);

    const transactionHash = transactionToSign.getSignatureHash();
    const delegatedHash = transactionToSign.getSignatureHash(
        address.fromPublicKey(secp256k1.derivePublicKey(signerPrivateKey))
    );
    const signature = Buffer.concat([
        secp256k1.sign(transactionHash, signerPrivateKey),
        secp256k1.sign(delegatedHash, delegatorPrivateKey)
    ]);

    // Return new signed transaction
    return new Transaction(transactionToSign.body, signature);
}

export { sign, signWithDelegator };
