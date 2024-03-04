import { assert, TRANSACTION } from '@vechain/vechain-sdk-errors';
import { type Transaction } from '../transaction';

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

export { assertCantGetFieldOnUnsignedTransaction };
