import { type DefaultErrorData } from '../../types';
import { ErrorBase } from '../base';

/**
 * Invalid bloom error to be thrown when an invalid bloom is detected.
 */
class InvalidBloomError extends ErrorBase<
    BLOOM.INVALID_BLOOM,
    DefaultErrorData
> {}

/**
 * Invalid k error to be thrown when an invalid k is detected.
 */
class InvalidKError extends ErrorBase<BLOOM.INVALID_K, DefaultErrorData> {}

/**
 * Errors enum.
 */
enum BLOOM {
    INVALID_BLOOM = 'INVALID_BLOOM',
    INVALID_K = 'INVALID_K'
}

export { InvalidBloomError, InvalidKError, BLOOM };
