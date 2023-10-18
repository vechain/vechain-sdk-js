import type { ADDRESS, DefaultErrorData } from '../types';
import { ErrorBase } from './base';

export class InvalidAddressError extends ErrorBase<
    ADDRESS.INVALID_ADDRESS,
    DefaultErrorData
> {}

export class InvalidChecksumError extends ErrorBase<
    ADDRESS.INVALID_CHECKSUM,
    DefaultErrorData
> {}
