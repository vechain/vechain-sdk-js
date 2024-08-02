import { describe, test } from '@jest/globals';
import { Hex } from '../../src/vcdm/Hex';

describe('Hex class tests', () => {
    test('should do something', () => {
        const num = -123.57;
        console.log(num);
        const hex = Hex.of(num);
        console.log(hex);
        console.log(hex.n);
    });
});
