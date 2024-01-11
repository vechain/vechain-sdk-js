import {
    DATA,
    SECP256K1,
    TRANSACTION,
    assert
} from '@vechain/vechain-sdk-errors';
import { dataUtils } from '../data';
import { type Transaction } from '../../transaction';

/**
 * Assert if transaction ID is valid
 *
 * @param transactionId - Transaction ID to assert
 */
function assertValidTransactionID(transactionId: string): void {
    assert(
        dataUtils.isThorId(transactionId, true),
        DATA.INVALID_DATA_TYPE,
        'Invalid transaction ID given as input. Input must be an hex string of length 64.',
        { transactionId }
    );
}

/**
 * Assert if transaction head is valid
 * @param head - Transaction head to assert
 */
function assertValidTransactionHead(head?: string): void {
    assert(
        head === undefined || dataUtils.isThorId(head, true),
        DATA.INVALID_DATA_TYPE,
        'Invalid head given as input. Input must be an hex string of length 64.',
        { head }
    );
}

/**
 * Asserts that the given transaction is signed.
 * @param tx - The transaction to check.
 *
 * @throws {InvalidTransactionError} if the transaction is not signed.
 */
const assertIsSignedTransaction = (tx: Transaction): void => {
    assert(tx.isSigned, TRANSACTION.NOT_SIGNED, 'Transaction must be signed.', {
        tx
    });
};

/**
 * Assert if private key used to sign a transaction is valid
 *
 * @param privateKey - Private key to assert
 * @param isValidPrivateKeyFunction - Function to assert private key
 * @param role - Role of the private key (e.g. delegator, or signer)
 */
function assertIsValidTransactionSigningPrivateKey(
    privateKey: Buffer,
    isValidPrivateKeyFunction: (privateKey: Buffer) => boolean,
    role?: string
): void {
    assert(
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
