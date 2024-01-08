import { describe, expect, test } from '@jest/globals';
import {
    concisifyFixtures,
    isEventFilterFixtures,
    isPromiseFixtures,
    isTransactionHashFixtures
} from './fixtures';
import {
    concisify,
    ethersToHardhatEvent,
    isEventFilter,
    isPromise,
    isTransactionHash
} from '../../../src';
import { NotImplementedError } from '@vechainfoundation/vechain-sdk-errors';

/**
 * Abstract provider tests
 *
 * @group integration/utils/abstract-provider
 */
describe('Abstract provider utils functions tests', () => {
    /**
     * Is promise util function tests
     */
    test('isPromise', () => {
        isPromiseFixtures.forEach(({ value, expected }) => {
            expect(isPromise(value)).toBe(expected);
        });
    });

    /**
     * concisify util function tests
     */
    test('concisify', () => {
        concisifyFixtures.forEach(({ value, expected }) => {
            expect(concisify(value)).toStrictEqual(expected);
        });
    });

    /**
     * isTransactionHash util function tests
     */
    test('isTransactionHash', () => {
        isTransactionHashFixtures.forEach(({ value, expected }) => {
            expect(isTransactionHash(value)).toBe(expected);
        });
    });

    /**
     * isEventFilter util function tests
     */
    test('isEventFilter', () => {
        isEventFilterFixtures.forEach(({ value, expected }) => {
            expect(isEventFilter(value)).toBe(expected);
        });
    });

    /**
     * ethersToHardhatEvent util function tests
     */
    test('ethersToHardhatEvent', () => {
        expect(() => ethersToHardhatEvent({})).toThrowError(
            NotImplementedError
        );
    });
});
