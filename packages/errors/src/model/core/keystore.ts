import { type DefaultErrorData } from '../../types';
import { ErrorBase } from '../base';

/**
 * Invalid keystore error to be thrown when an invalid keystore is detected.
 */
class InvalidKeystoreError extends ErrorBase<
    KEYSTORE.INVALID_KEYSTORE,
    DefaultErrorData
> {}

/**
 * Invalid password error to be thrown when an invalid password is provided.
 */
class InvalidKeystorePasswordError extends ErrorBase<
    KEYSTORE.INVALID_PASSWORD,
    DefaultErrorData
> {}

/**
 * Errors enum.
 */
enum KEYSTORE {
    INVALID_KEYSTORE = 'INVALID_KEYSTORE',
    INVALID_PASSWORD = 'INVALID_PASSWORD'
}

export { InvalidKeystoreError, InvalidKeystorePasswordError, KEYSTORE };
