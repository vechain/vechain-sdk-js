import { assert, DATA, SECP256K1, TRANSACTION } from '@vechain/sdk-errors';
import { type Transaction } from '../../transaction';
import { Hex0x } from '../../utils';

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
        Hex0x.isThorId(transactionId),
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
        head === undefined || Hex0x.isThorId(head),
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
        `Invalid ${role} private key used to sign the transaction. Ensure it's a valid secp256k1 private key.`,
        { privateKey }
    );
}

/**
 * Assert if transaction is not signed and cannot get field (e.g. delegator, origin, or id)
 *
 * @param methodName - The name of the method calling this assertion.
 * @param transaction - Transaction to assert
 * @param fieldToGet - Field to get (e.g. delegator, origin, or id)
 */
function assertCantGetFieldOnUnsignedTransaction(
    methodName: string,
    transaction: Transaction,
    fieldToGet: string
): void {
    assert(
        `assertCantGetFieldOnUnsignedTransaction - ${methodName}`,
        transaction.isSigned,
        TRANSACTION.NOT_SIGNED,
        `Cannot get ${fieldToGet} from unsigned transaction. Sign the transaction first.`
    );
}

export {
    assertValidTransactionID,
    assertValidTransactionHead,
    assertIsSignedTransaction,
    assertIsValidTransactionSigningPrivateKey,
    assertCantGetFieldOnUnsignedTransaction
};
