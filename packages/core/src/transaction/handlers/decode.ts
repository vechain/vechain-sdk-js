import { type RLPValidObject } from '../../encoding';
import {
    SIGNED_TRANSACTION_RLP,
    TRANSACTION_FEATURES_KIND,
    UNSIGNED_TRANSACTION_RLP
} from '../../utils';
import { Transaction } from '../transaction';
import { type TransactionBody } from '../types';
import { InvalidTransactionField } from '@vechain/sdk-errors';

/**
 * Decode a raw transaction.
 * It can be signed or unsigned.
 *
 * @param rawTransaction - Raw transaction to decode
 * @param isSigned - If the transaction is signed or not
 * @returns Decoded transaction (signed or unsigned)
 */
function decode(rawTransaction: Buffer, isSigned: boolean): Transaction {
    // Get correct decoder profiler
    const decoder = isSigned
        ? SIGNED_TRANSACTION_RLP
        : UNSIGNED_TRANSACTION_RLP;

    // Get decoded body
    const decodedRLPBody = decoder.decodeObject(
        rawTransaction
    ) as RLPValidObject;

    // Create correct transaction body without reserved field
    const bodyWithoutReservedField: TransactionBody = {
        blockRef: decodedRLPBody.blockRef as string,
        chainTag: decodedRLPBody.chainTag as number,
        clauses: decodedRLPBody.clauses as [],
        dependsOn: decodedRLPBody.dependsOn as string | null,
        expiration: decodedRLPBody.expiration as number,
        gas: decodedRLPBody.gas as number,
        gasPriceCoef: decodedRLPBody.gasPriceCoef as number,
        nonce: decodedRLPBody.nonce as number
    };

    // Create correct transaction body (with correct reserved field)
    const correctTransactionBody: TransactionBody =
        (decodedRLPBody.reserved as Buffer[]).length > 0
            ? {
                  ...bodyWithoutReservedField,
                  reserved: _decodeReservedField(
                      decodedRLPBody.reserved as Buffer[]
                  )
              }
            : bodyWithoutReservedField;

    // Return decoded transaction (with signature or not)
    return decodedRLPBody.signature !== undefined
        ? new Transaction(
              correctTransactionBody,
              decodedRLPBody.signature as Buffer
          )
        : new Transaction(correctTransactionBody);
}

/**
 * Decode reserved field.
 *
 * It can be optional or not.
 * For this reason (as already done in _encodeReservedField in Transaction class)
 * we create an ad hoc method.
 *
 * @param reserved - Reserved field to decode
 * @returns Decoded reserved field
 * @throws {InvalidTransactionField}
 */
function _decodeReservedField(reserved: Buffer[]): {
    features?: number;
    unused?: Buffer[];
} {
    // Not trimmed reserved field
    if (reserved[reserved.length - 1].length === 0) {
        throw new InvalidTransactionField(
            '_decodeReservedField()',
            'Invalid reserved field. Fields in the reserved buffer must be properly trimmed.',
            { fieldName: 'reserved', reserved }
        );
    }

    // Get features field
    const featuresField = TRANSACTION_FEATURES_KIND.kind
        .buffer(reserved[0], TRANSACTION_FEATURES_KIND.name)
        .decode() as number;

    // Return encoded reserved field
    return reserved.length > 1
        ? {
              features: featuresField,
              unused: reserved.slice(1)
          }
        : { features: featuresField };
}

export { decode };
