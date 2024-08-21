import { VechainSDKError } from '../sdk-error';
import { type ObjectErrorData } from '../types';

/**
 * Invalid cast type error.
 *
 * WHEN TO USE:
 * * Error will be thrown when a method call or property read fails.
 */
class InvalidOperation extends VechainSDKError<ObjectErrorData> {}

export { InvalidOperation };
