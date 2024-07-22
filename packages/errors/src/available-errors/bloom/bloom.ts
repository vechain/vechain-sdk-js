import { VechainSDKError } from '../sdk-error';
import { type ObjectErrorData } from '../types';

/**
 * Invalid bloom error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the bloom is invalid.
 */
class InvalidBloom extends VechainSDKError<ObjectErrorData> {}

/**
 * Invalid bloom params error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the bloom params are invalid.
 */
class InvalidBloomParams extends VechainSDKError<ObjectErrorData> {}

export { InvalidBloom, InvalidBloomParams };
