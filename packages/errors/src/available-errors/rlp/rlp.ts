import { VechainSDKError } from '../sdk-error';
import type { ObjectErrorData } from '../types';

/**
 * Invalid RLP error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the RLP is invalid.
 */
class InvalidRLP extends VechainSDKError<{
    context: string;
    data: ObjectErrorData;
}> {}

export { InvalidRLP };
