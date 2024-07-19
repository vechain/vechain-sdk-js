import { VechainSDKError } from '../sdk-error';

/**
 * Invalid secp256k1 private key error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the secp256k1 private key is invalid.
 *
 * @note Data (private key) is undefined for security reasons, the private key should not be logged!
 */
class InvalidSecp256k1PrivateKey extends VechainSDKError<undefined> {}

/**
 * Invalid secp256k1 message hash error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the secp256k1 message hash is invalid.
 */
class InvalidSecp256k1MessageHash extends VechainSDKError<{
    messageHash: Uint8Array;
}> {}

/**
 * Invalid secp256k1 signature error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the secp256k1 signature is invalid.
 */
class InvalidSecp256k1Signature extends VechainSDKError<{
    signature: Uint8Array;
    recovery?: number;
}> {}

export {
    InvalidSecp256k1PrivateKey,
    InvalidSecp256k1MessageHash,
    InvalidSecp256k1Signature
};
