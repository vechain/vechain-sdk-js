import {
    assert,
    SECP256K1,
    TRANSACTION
} from '@vechainfoundation/vechain-sdk-errors';
import { type Transaction } from '../transaction';

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
        `Invalid ${role} private key used to sign the transaction.`,
        { privateKey }
    );
}

/**
 * Assert if transaction is already signed
 *
 * @param transaction - Transaction to assert
 */
function assertTransactionIsNotSigned(transaction: Transaction): void {
    assert(
        !transaction.isSigned,
        TRANSACTION.ALREADY_SIGNED,
        'Cannot sign Transaction. It is already signed.',
        { transaction }
    );
}

/**
 * Assert if transaction is not signed and cannot get field (e.g. delegator, origin, or id)
 *
 * @param transaction - Transaction to assert
 * @param fieldToGet - Field to get (e.g. delegator, origin, or id)
 */
function assertCantGetFieldOnUnsignedTransaction(
    transaction: Transaction,
    fieldToGet: string
): void {
    assert(
        transaction.isSigned,
        TRANSACTION.NOT_SIGNED,
        `Cannot get ${fieldToGet} from unsigned transaction. Sign the transaction first.`
    );
}

export {
    assertIsValidTransactionSigningPrivateKey,
    assertTransactionIsNotSigned,
    assertCantGetFieldOnUnsignedTransaction
};
