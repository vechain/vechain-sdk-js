import { VechainSDKError } from '../sdk-error';

/**
 * Unavailable transaction field name.
 *
 * This error is thrown a field name in a transaction is unavailable.
 *
 * e.g. we want to get the value of 'delegator' or 'id' or 'origin' from a not signed transaction
 */
class UnavailableTransactionField extends VechainSDKError<{
    fieldName: string;
}> {}

export { UnavailableTransactionField };
