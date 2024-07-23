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

export { InvalidDataType };
