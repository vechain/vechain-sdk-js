import { VechainSDKError } from '../sdk-error';
import { type ObjectErrorData } from '../types';

/**
 * Invalid data error to be thrown when invalid data is detected.
 *
 * This error is thrown when invalid data is detected.
 */
class InvalidDataType extends VechainSDKError<ObjectErrorData> {}

export { InvalidDataType };
