import { VechainSDKError } from '../sdk-error';

/**
 * Invalid cast type error.
 *
 * WHEN TO USE:
 * * Error will be thrown when a cast between types is invalid.
 */
class InvalidCastType<T> extends VechainSDKError<T> {}

export { InvalidCastType };
