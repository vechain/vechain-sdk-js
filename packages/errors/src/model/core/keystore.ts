import { type DefaultErrorData } from '../../types';
import { ErrorBase } from '../base';

/**
 * Invalid keystore error to be thrown when an invalid keystore is detected.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class InvalidKeystoreError extends ErrorBase<
    KEYSTORE.INVALID_KEYSTORE,
    DefaultErrorData
> {}

/**
 * Invalid password error to be thrown when an invalid password is provided.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class InvalidKeystorePasswordError extends ErrorBase<
    KEYSTORE.INVALID_PASSWORD,
    DefaultErrorData
> {}

/**
 * Errors  enum.
 *
 * @public
 */
enum KEYSTORE {
    INVALID_KEYSTORE = 'INVALID_KEYSTORE',
    INVALID_PASSWORD = 'INVALID_PASSWORD'
}

export { InvalidKeystoreError, InvalidKeystorePasswordError, KEYSTORE };
