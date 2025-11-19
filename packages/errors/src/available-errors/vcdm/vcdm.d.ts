import { VechainSDKError } from '../sdk-error';
import { type ObjectErrorData } from '../types';
/**
 * Invalid cast type error.
 *
 * WHEN TO USE:
 * * Error will be thrown when a method call or property read fails.
 */
declare class InvalidOperation extends VechainSDKError<ObjectErrorData> {
}
export { InvalidOperation };
//# sourceMappingURL=vcdm.d.ts.map