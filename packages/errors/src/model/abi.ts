import type { ABI_HIGH_LEVEL, ABI_LOW_LEVEL, DefaultErrorData } from '../types';
import { ErrorBase } from './base';

/**
 * Invalid data to decode error to be thrown when an invalid data is detected during decoding.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
export class InvalidAbiHighLevelDataToDecodeError extends ErrorBase<
    ABI_HIGH_LEVEL.INVALID_DATA_TO_DECODE,
    DefaultErrorData
> {}

/**
 * Invalid data to encode error to be thrown when an invalid data is detected during encoding.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
export class InvalidAbiHighLevelDataToEncodeError extends ErrorBase<
    ABI_HIGH_LEVEL.INVALID_DATA_TO_ENCODE,
    DefaultErrorData
> {}

/**
 * Invalid event error to be thrown when an invalid event is detected.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
export class InvalidAbiEventError extends ErrorBase<
    ABI_HIGH_LEVEL.INVALID_EVENT,
    DefaultErrorData
> {}

/**
 * Invalid format error to be thrown when an invalid format is provided.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
export class InvalidAbiFormatTypeError extends ErrorBase<
    ABI_HIGH_LEVEL.INVALID_FORMAT_TYPE,
    DefaultErrorData
> {}

/**
 * Invalid function error to be thrown when an invalid function is detected.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
export class InvalidAbiFunctionError extends ErrorBase<
    ABI_HIGH_LEVEL.INVALID_FUNCTION,
    DefaultErrorData
> {}

/**
 * Invalid function error to be thrown when an invalid function is detected.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
export class InvalidAbiLowLevelDataToDecodeError extends ErrorBase<
    ABI_LOW_LEVEL.INVALID_DATA_TO_DECODE,
    DefaultErrorData
> {}

/**
 * Invalid data to encode error to be thrown when an invalid data is detected during encoding.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
export class InvalidAbiLowLevelDataToEncodeError extends ErrorBase<
    ABI_LOW_LEVEL.INVALID_DATA_TO_ENCODE,
    DefaultErrorData
> {}
