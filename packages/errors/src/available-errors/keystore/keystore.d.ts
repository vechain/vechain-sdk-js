import { VechainSDKError } from '../sdk-error';
import { type ObjectErrorData } from '../types';
/**
 * Invalid keystore error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the keystore is invalid.
 */
declare class InvalidKeystore extends VechainSDKError<ObjectErrorData> {
}
/**
 * Invalid keystore params error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the keystore params are invalid.
 */
declare class InvalidKeystoreParams extends VechainSDKError<ObjectErrorData> {
}
export { InvalidKeystore, InvalidKeystoreParams };
//# sourceMappingURL=keystore.d.ts.map