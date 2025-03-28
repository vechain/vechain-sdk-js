import { describe, expect, jest, test } from '@jest/globals';
import { VeChainSDKError } from '../../src';

describe('VeChainSDKError', () => {
    describe('constructor', () => {
        test('ok <- full args', () => {
            const fqn = 'file!Class.method';
            const message = 'An error occurred';
            const args = { key: 'value' };
            const cause = new Error('Cause error');

            const error = new VeChainSDKError(fqn, message, args, cause);

            expect(error.fqn).toBe(fqn);
            expect(error.message).toBe(message);
            expect(error.args).toEqual(args);
            expect(error.cause).toBe(cause);
        });
    });

    describe('toString()', () => {
        test('ok <- full properties', () => {
            const fqn = 'file!Class.method';
            const message = 'Stringify test';
            const args = { key: 'value' };
            const cause = new Error('Cause error');

            const error = new VeChainSDKError(fqn, message, args, cause);

            const expectedOutput = [
                `VeChainSDKError: ${message}`,
                `@${VeChainSDKError.TAG}:${fqn}`,
                `args: {"key":"value"}`,
                `cause: ${cause.toString()}`
            ].join('\n\t');

            expect(error.toString()).toBe(expectedOutput);
        });

        test('ok <- default properties', () => {
            const fqn = 'file!Class.method';
            const message = 'No args or cause';

            const error = new VeChainSDKError(fqn, message);

            const expectedOutput = [
                `VeChainSDKError: ${message}`,
                `@${VeChainSDKError.TAG}:${fqn}`
            ].join('\n\t');

            expect(error.toString()).toBe(expectedOutput);
        });

        test('ok <- custom joiner', () => {
            const fqn = 'file!Class.method';
            const message = 'Custom joiner test';
            const args = { key: 'value' };

            const error = new VeChainSDKError(fqn, message, args);

            const expectedOutput = [
                `VeChainSDKError: ${message}`,
                `@${VeChainSDKError.TAG}:${fqn}`,
                `args: {"key":"value"}`
            ].join('\n|');

            expect(error.toString('\n|')).toBe(expectedOutput);
        });

        test('ok <- custom stringify', () => {
            const fqn = 'file!Class.method';
            const message = 'Custom stringify test';
            const args = { key: 'value' };

            const error = new VeChainSDKError(fqn, message, args);

            const customStringify = jest.fn((obj) =>
                JSON.stringify(obj, null, 2)
            );

            const expectedOutput = [
                `VeChainSDKError: ${message}`,
                `@${VeChainSDKError.TAG}:${fqn}`,
                `args: ${JSON.stringify(args, null, 2)}`
            ].join('\n\t');

            expect(error.toString('\n\t', customStringify)).toBe(
                expectedOutput
            );
            expect(customStringify).toHaveBeenCalledWith(args);
        });
    });
});
