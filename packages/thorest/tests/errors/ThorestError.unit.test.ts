import { describe, expect, test } from '@jest/globals';
import { ThorestError } from '../../src/errors';
import { VeChainSDKError } from '@vechain/sdk-core';

describe('ThorestError', () => {
    describe('constructor', () => {
        test('ok <- default status', () => {
            const error = new ThorestError('TestFQN', 'Test message');
            expect(error).toBeInstanceOf(ThorestError);
            expect(error.fqn).toBe('TestFQN');
            expect(error.message).toBe('Test message');
            expect(error.status).toBe(0);
        });

        test('ok <- set status', () => {
            const error = new ThorestError(
                'TestFQN',
                'Test message',
                undefined,
                undefined,
                404
            );
            expect(error).toBeInstanceOf(ThorestError);
            expect(error.fqn).toBe('TestFQN');
            expect(error.message).toBe('Test message');
            expect(error.status).toBe(404);
        });

        test('ok <- with arguments', () => {
            const args = { key: 'value' };
            const error = new ThorestError('TestFQN', 'Test message', args);
            expect(error.args).toEqual(args);
        });

        test('ok <- with a cause', () => {
            const cause = new Error('Underlying error');
            const error = new ThorestError(
                'TestFQN',
                'Test message',
                undefined,
                cause
            );
            expect(error.cause).toBe(cause);
        });
    });

    describe('inheritance', () => {
        test('should inherit from VeChainSDKError', () => {
            const error = new ThorestError('TestFQN', 'Test message');
            expect(error).toBeInstanceOf(VeChainSDKError);
        });
    });
});
