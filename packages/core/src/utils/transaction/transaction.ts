import { address } from '../../address';
import { type TransactionClause } from '../../transaction';
import { TRANSACTIONS_GAS_CONSTANTS } from '../const';
import { dataUtils } from '../data';
import { ERRORS } from '../errors';

/**
 * Calculates intrinsic gas that a tx costs with the given set of clauses.
 *
 * @note see the folloging link for more details: https://docs.vechain.org/core-concepts/transactions/transaction-calculation
 *
 * @param clauses Transaction clauses
 * @returns Intrinsic gasof a set of clauses
 */
function intrinsicGas(clauses: TransactionClause[]): number {
    // No clauses
    if (clauses.length === 0) {
        return (
            TRANSACTIONS_GAS_CONSTANTS.TX_GAS +
            TRANSACTIONS_GAS_CONSTANTS.CLAUSE_GAS
        );
    }

    // Some clauses
    return clauses.reduce((sum, clause: TransactionClause) => {
        if (clause.to !== null) {
            // Invalid address
            if (!address.isAddress(clause.to)) {
                throw new Error(ERRORS.DATA.INVALID_DATA_TYPE('an address'));
            }

            sum += TRANSACTIONS_GAS_CONSTANTS.CLAUSE_GAS;
        } else {
            sum += TRANSACTIONS_GAS_CONSTANTS.CLAUSE_GAS_CONTRACT_CREATION;
        }
        sum += _calculateDataUsedGas(clause.data);
        return sum;
    }, TRANSACTIONS_GAS_CONSTANTS.TX_GAS);
}

/**
 * Calculates gas used by data.
 *
 * @param data Data to calculate gas
 * @returns Gas used by data
 */
function _calculateDataUsedGas(data: string): number {
    // Invalid data
    if (data !== '' && !dataUtils.isHexString(data)) {
        throw new Error(ERRORS.DATA.INVALID_DATA_TYPE('a hexadecimal string'));
    }

    let sum = 0;
    for (let i = 2; i < data.length; i += 2) {
        if (data.substring(i, i + 2) === '00') {
            sum += TRANSACTIONS_GAS_CONSTANTS.ZERO_GAS_DATA;
        } else {
            sum += TRANSACTIONS_GAS_CONSTANTS.NON_ZERO_GAS_DATA;
        }
    }
    return sum;
}

export { intrinsicGas };
