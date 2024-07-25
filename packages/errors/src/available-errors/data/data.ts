import { VechainSDKError } from '../sdk-error';
import { type ObjectErrorData } from '../types';

/**
 * Invalid data type error.
 *
 * WHEN TO USE:
 * * This error will be thrown when the data type is invalid.
 * -e.g.- when the data type is not a string, number, boolean, or object.
 */
class InvalidDataType extends VechainSDKError<ObjectErrorData> {}

/**
 * Unsupported operation error.
 *
 * WHEN TO USE:
 * * This error will be thrown when an operation is not supported.
 * -e.g.- into the ethers adapter, when the runner does not support sending transactions.
 */
class UnsupportedOperation extends VechainSDKError<ObjectErrorData> {}

export { InvalidDataType, UnsupportedOperation };
