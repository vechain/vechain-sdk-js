import { InvalidDataType } from '@vechain/sdk-errors';
import { type TransactionClause } from '../../transaction';
import { Address } from '../../vcdm';
import { Hex } from '../../vcdm/Hex';
import { TRANSACTIONS_GAS_CONSTANTS } from '../const';

/**
 * Calculates intrinsic gas that a tx costs with the given set of clauses.
 *
 * @note see the following link for more details: https://docs.vechain.org/core-concepts/transactions/transaction-calculation
 *
 * @param clauses - Transaction clauses
 * @returns Intrinsic gas of a set of clauses
 * @throws {InvalidDataType}
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
            // Invalid address or no vet.domains name
            if (!Address.isValid(clause.to) && !clause.to.includes('.'))
                throw new InvalidDataType(
                    'TransactionUtils.intrinsicGas()',
                    `Invalid data type in clause. Each 'to' field must be a valid address.`,
                    { clause }
                );

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
 * @throws {InvalidDataType}
 */
function _calculateDataUsedGas(data: string): number {
    // Invalid data
    if (data !== '' && !Hex.isValid(data))
        throw new InvalidDataType(
            '_calculateDataUsedGas()',
            `Invalid data type for gas calculation. Data should be a hexadecimal string.`,
            { data }
        );

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

const TransactionUtils = { intrinsicGas };
export { TransactionUtils };
