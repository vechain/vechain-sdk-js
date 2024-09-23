import { VechainSDKError } from '../sdk-error';
import { type ObjectErrorData } from '../types';

/**
 * Invalid data to encode/decode abi error
 *
 * WHEN TO USE:
 * * This error will be thrown when the data to encode or decode into abi is invalid.
 */
class InvalidAbiDataToEncodeOrDecode extends VechainSDKError<ObjectErrorData> {}

/**
 * Invalid ABI item error
 *
 * WHEN TO USE:
 * * This error will be thrown when the ABI item is invalid.
 */
class InvalidAbiItem extends VechainSDKError<{
    type: 'function' | 'event';
    value: unknown;
}> {}

/**
 * Invalid abi signature format error
 *
 * WHEN TO USE:
 * * This error will be thrown when the abi signature format is invalid.
 */
class InvalidAbiSignatureFormat extends VechainSDKError<{
    signatureFormat: string;
}> {}

export {
    InvalidAbiDataToEncodeOrDecode,
    InvalidAbiItem,
    InvalidAbiSignatureFormat
};
