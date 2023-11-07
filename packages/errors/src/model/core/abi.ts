import { type DefaultErrorData } from '../../types';
import { ErrorBase } from '../base';

/**
 * Invalid data to decode error to be thrown when an invalid data is detected during decoding.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class InvalidAbiDataToDecodeError extends ErrorBase<
    ABI.INVALID_DATA_TO_DECODE,
    DefaultErrorData
> {}

/**
 * Invalid data to encode error to be thrown when an invalid data is detected during encoding.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class InvalidAbiDataToEncodeError extends ErrorBase<
    ABI.INVALID_DATA_TO_ENCODE,
    DefaultErrorData
> {}

/**
 * Invalid event error to be thrown when an invalid event is detected.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class InvalidAbiEventError extends ErrorBase<
    ABI.INVALID_EVENT,
    DefaultErrorData
> {}

/**
 * Invalid format error to be thrown when an invalid format is provided.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class InvalidAbiFormatTypeError extends ErrorBase<
    ABI.INVALID_FORMAT_TYPE,
    DefaultErrorData
> {}

/**
 * Invalid function error to be thrown when an invalid function is detected.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class InvalidAbiFunctionError extends ErrorBase<
    ABI.INVALID_FUNCTION,
    DefaultErrorData
> {}

/**
 * Invalid function error to be thrown when an invalid function is detected.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class ContractInterfaceError extends ErrorBase<
    ABI.CONTRACT_INTERFACE_ERROR,
    DefaultErrorData
> {}

/**
 * Errors enum.
 *
 * @public
 */
enum ABI {
    INVALID_FUNCTION = 'INVALID_FUNCTION',
    INVALID_EVENT = 'INVALID_EVENT',
    INVALID_DATA_TO_DECODE = 'INVALID_DATA_TO_DECODE',
    INVALID_DATA_TO_ENCODE = 'INVALID_DATA_TO_ENCODE',
    INVALID_FORMAT_TYPE = 'INVALID_FORMAT_TYPE',
    CONTRACT_INTERFACE_ERROR = 'CONTRACT_INTERFACE_ERROR'
}

export {
    InvalidAbiDataToDecodeError,
    InvalidAbiDataToEncodeError,
    InvalidAbiEventError,
    InvalidAbiFormatTypeError,
    InvalidAbiFunctionError,
    ContractInterfaceError,
    ABI
};
