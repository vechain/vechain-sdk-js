import { describe, expect, test } from '@jest/globals';
import { PostDebugTracerRequest } from '@thor/thorest/debug';
import { IllegalArgumentError } from '@common/errors';
import { type PostDebugTracerRequestJSON } from '@thor/thorest/json';

/**
 * @group unit/debug
 */
describe('PostDebugTracerRequest UNIT tests', () => {
    test('err <- constructor illegal', () => {
        const expected = {
            name: 'call',
            config: { some: 'config' },
            target: 'illegal target'
        } satisfies PostDebugTracerRequestJSON;
        expect(() => new PostDebugTracerRequest(expected)).toThrow(
            IllegalArgumentError
        );
    });

    test('ok <- constructor with all fields', () => {
        const expected = {
            name: 'call',
            config: { some: 'config' },
            target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
        } satisfies PostDebugTracerRequestJSON;

        const actual = new PostDebugTracerRequest(expected);
        expect(actual.toJSON()).toEqual(expected);
    });

    test('ok <- constructor with minimal fields', () => {
        const expected = {
            target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
        } satisfies PostDebugTracerRequestJSON;

        const actual = new PostDebugTracerRequest(expected);
        expect(actual.toJSON()).toEqual(expected);
    });
});
