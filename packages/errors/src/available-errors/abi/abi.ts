import { VechainSDKError } from '../sdk-error';
import { type ObjectErrorData } from '../types';

/**
 * Invalid data to encode/decode abi.
 *
 * This error is thrown when the data to encode or decode into abi is invalid.
 */
class InvalidAbiDataToEncodeOrDecode extends VechainSDKError<ObjectErrorData> {}

/**
 * Invalid fragment type.
 *
 * This error is thrown when the fragment type is invalid.
 */
class InvalidAbiFragment extends VechainSDKError<{
    type: 'function' | 'event';
    fragment: unknown;
}> {}

/**
 * Invalid abi signature format.
 *
 * This error is thrown when the abi signature format is invalid.
 */
class InvalidAbiSignatureFormat extends VechainSDKError<{
    signatureFormat: string;
}> {}

export {
    InvalidAbiDataToEncodeOrDecode,
    InvalidAbiFragment,
    InvalidAbiSignatureFormat
};
