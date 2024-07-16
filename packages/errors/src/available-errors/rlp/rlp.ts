import { VechainSDKError } from '../sdk-error';
import type { ObjectErrorData } from '../types';

/**
 * Invalid RLP error is thrown.
 *
 * This error is thrown when an invalid RLP is detected.
 */
class InvalidRLP extends VechainSDKError<{
    context: string;
    data: ObjectErrorData;
}> {}

export { InvalidRLP };
