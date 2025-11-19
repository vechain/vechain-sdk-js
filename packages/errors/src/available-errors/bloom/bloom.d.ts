import { VechainSDKError } from '../sdk-error';
import { type ObjectErrorData } from '../types';
/**
 * Invalid bloom error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the bloom is invalid.
 */
declare class InvalidBloom extends VechainSDKError<ObjectErrorData> {
}
/**
 * Invalid bloom params error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the bloom params are invalid.
 */
declare class InvalidBloomParams extends VechainSDKError<ObjectErrorData> {
}
export { InvalidBloom, InvalidBloomParams };
//# sourceMappingURL=bloom.d.ts.map