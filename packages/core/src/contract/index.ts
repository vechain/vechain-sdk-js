import { txBuilder } from './contract';
import { coder } from './coder';

export const contract = {
    txBuilder,
    coder
};
export * from './types.d';
export * from '../../tests/contract/compiler';
