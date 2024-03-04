import {
    assert,
    DATA,
    SECP256K1,
    TRANSACTION
} from '@vechain/vechain-sdk-errors';
import { dataUtils } from '../data';
import { type Transaction } from '../../transaction';

/**
 * Assert if transaction ID is valid
 *
 * @param methodName - The name of the method calling this assertion.
 * @param transactionId - Transaction ID to assert
 */
function assertValidTransactionID(
    methodName: string,
    transactionId: string
): void {
    assert(
        `assertValidTransactionID - ${methodName}`,
        dataUtils.isThorId(transactionId, true),
        DATA.INVALID_DATA_TYPE,
        'Invalid transaction ID given as input. Input must be an hex string of length 64.',
        { transactionId }
    );
}

/**
 * Assert if transaction head is valid
 *
 * @param methodName - The name of the method calling this assertion.
 * @param head - Transaction head to assert
 */
function assertValidTransactionHead(methodName: string, head?: string): void {
    assert(
        `assertValidTransactionHead - ${methodName}`,
        head === undefined || dataUtils.isThorId(head, true),
        DATA.INVALID_DATA_TYPE,
        'Invalid head given as input. Input must be an hex string of length 64.',
        { head }
    );
}

/**
 * Asserts that the given transaction is signed.
 *
 * @param methodName - The name of the method calling this assertion.
 * @param tx - The transaction to check.
 */
function assertIsSignedTransaction(methodName: string, tx: Transaction): void {
    assert(
        `assertIsSignedTransaction - ${methodName}`,
        tx.isSigned,
        TRANSACTION.NOT_SIGNED,
        'Transaction must be signed.',
        {
            tx
        }
    );
}

/**
 * Assert if a private key used to sign a transaction is valid
 *
 * @param methodName - The name of the method calling this assertion.
 * @param privateKey - Private key to assert
 * @param isValidPrivateKeyFunction - Function to assert private key
 * @param role - Role of the private key (e.g., delegator, or signer)
 */
function assertIsValidTransactionSigningPrivateKey(
    methodName: string,
    privateKey: Buffer,
    isValidPrivateKeyFunction: (privateKey: Buffer) => boolean,
    role?: string
): void {
    assert(
        `assertIsValidTransactionSigningPrivateKey - ${methodName}`,
        isValidPrivateKeyFunction(privateKey),
        SECP256K1.INVALID_SECP256k1_PRIVATE_KEY,
        `Invalid ${role} private key used to sign the transaction. Ensure it's a valid SECP256k1 private key.`,
        { privateKey }
    );
}

export {
    assertValidTransactionID,
    assertValidTransactionHead,
    assertIsSignedTransaction,
    assertIsValidTransactionSigningPrivateKey
};
