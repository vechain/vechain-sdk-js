import { type DefaultErrorData } from '../../types';
import { ErrorBase } from '../base';

/**
 * Invalid data to decode error to be thrown when an invalid data is detected during decoding.
 */
class InvalidAbiDataToDecodeError extends ErrorBase<
    ABI.INVALID_DATA_TO_DECODE,
    DefaultErrorData
> {}

/**
 * Invalid data to encode error to be thrown when an invalid data is detected during encoding.
 */
class InvalidAbiDataToEncodeError extends ErrorBase<
    ABI.INVALID_DATA_TO_ENCODE,
    DefaultErrorData
> {}

/**
 * Invalid event error to be thrown when an invalid event is detected.
 */
class InvalidAbiEventError extends ErrorBase<
    ABI.INVALID_EVENT,
    DefaultErrorData
> {}

/**
 * Invalid format error to be thrown when an invalid format is provided.
 */
class InvalidAbiFormatTypeError extends ErrorBase<
    ABI.INVALID_FORMAT_TYPE,
    DefaultErrorData
> {}

/**
 * Invalid function error to be thrown when an invalid function is detected.
 */
class InvalidAbiFunctionError extends ErrorBase<
    ABI.INVALID_FUNCTION,
    DefaultErrorData
> {}

/**
 * Invalid function error to be thrown when an invalid function is detected.
 */
class ContractInterfaceError extends ErrorBase<
    ABI.CONTRACT_INTERFACE_ERROR,
    DefaultErrorData
> {}

/**
 * Errors enum.
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
