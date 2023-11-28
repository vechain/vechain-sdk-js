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
function assertTransactionAlreadySigned(transaction: Transaction): void {
    assert(
        !transaction.isSigned,
        TRANSACTION.ALREADY_SIGNED,
        'Cannot sign Transaction. It is already signed.',
        { transaction }
    );
}

export {
    assertIsValidTransactionSigningPrivateKey,
    assertTransactionAlreadySigned
};
