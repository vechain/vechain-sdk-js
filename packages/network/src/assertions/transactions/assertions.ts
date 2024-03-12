import {
    assertIsValidTransactionSigningPrivateKey,
    secp256k1,
    Transaction,
    type TransactionBody
} from '@vechain/sdk-core';
import { assert, TRANSACTION } from '@vechain/sdk-errors';

/**
 * Asserts that the transaction can be signed by validating the private key and the transaction body.
 *
 * @param methodName - The method name where the error was thrown.
 * @param originSignature - The signature of the transaction.
 * @param txBody - The transaction body.
 *
 * @throws an error if the transaction cannot be signed.
 */
const assertTransactionCanBeSigned = (
    methodName: string,
    originSignature: Buffer,
    txBody: TransactionBody
): void => {
    // Check if the private key is valid
    assertIsValidTransactionSigningPrivateKey(
        `assertTransactionCanBeSigned - ${methodName}`,
        originSignature,
        secp256k1.isValidPrivateKey,
        'origin'
    );

    // Check if the transaction body is valid
    assert(
        `assertTransactionCanBeSigned - ${methodName}`,
        Transaction.isValidBody(txBody),
        TRANSACTION.INVALID_TRANSACTION_BODY,
        'Invalid transaction body provided, the transaction cannot be signed. Please check the transaction fields.'
    );
};

export { assertTransactionCanBeSigned };
