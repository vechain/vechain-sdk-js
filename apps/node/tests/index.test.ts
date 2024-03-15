import { describe, expect, test } from '@jest/globals';
import { generateMnemonic } from '../src';

describe('index - Test', () => {
    test('Should create a mnemonic', () => {
        const mnemonic = generateMnemonic();
        expect(mnemonic).toHaveLength(12);
    });
});
