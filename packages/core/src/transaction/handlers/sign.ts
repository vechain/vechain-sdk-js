import { addressUtils } from '../../address';
import { secp256k1 } from '../../secp256k1';
import { Transaction } from '../transaction';
import { assert, TRANSACTION } from '@vechainfoundation/vechain-sdk-errors';
import { assertTransactionIsNotSigned } from '../helpers/assertions';
import { assertIsValidTransactionSigningPrivateKey } from '../../utils';

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
    assertIsValidTransactionSigningPrivateKey(
        signerPrivateKey,
        secp256k1.isValidPrivateKey
    );

    // Transaction is already signed
    assertTransactionIsNotSigned(transactionToSign);

    // Transaction is delegated
    assert(
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
    assertIsValidTransactionSigningPrivateKey(
        signerPrivateKey,
        secp256k1.isValidPrivateKey,
        'signer'
    );
    assertIsValidTransactionSigningPrivateKey(
        delegatorPrivateKey,
        secp256k1.isValidPrivateKey,
        'delegator'
    );

    // Transaction is already signed
    assertTransactionIsNotSigned(transactionToSign);

    // Transaction is not delegated
    assert(
        transactionToSign.isDelegated,
        TRANSACTION.INVALID_DELEGATION,
        'Transaction is not delegated. Use sign method instead.',
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
