import { assert, TRANSACTION } from '@vechain/vechain-sdk-errors';
import { type Transaction } from '../transaction';

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
    assertTransactionIsNotSigned,
    assertCantGetFieldOnUnsignedTransaction
};
