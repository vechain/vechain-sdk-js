import { VechainSDKError } from '../sdk-error';

/**
 * Invalid private error to be thrown when an invalid private key is detected.
 *
 * This error is thrown when an invalid private key is detected.
 *
 * @note Data is undefined because for security reasons, the private key should not be logged!
 */
class InvalidSecp256k1PrivateKey extends VechainSDKError<undefined> {}

/**
 * Invalid message hash error to be thrown when an invalid message hash is detected.
 *
 * This error is thrown when an invalid message hash is detected.
 */
class InvalidSecp256k1MessageHash extends VechainSDKError<{
    messageHash: Uint8Array;
}> {}

export { InvalidSecp256k1PrivateKey, InvalidSecp256k1MessageHash };
