import { describe, expect, test } from '@jest/globals';

/**
 * Simple test
 * @group int/simple
 */
describe('Simple test', () => {
    test('Should pass', () => {
        expect(1).toBe(1);
    });
});
