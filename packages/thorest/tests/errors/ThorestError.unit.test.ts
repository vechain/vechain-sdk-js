import { describe, expect, test } from '@jest/globals';
import { ThorError } from '../../src/errors';
import { VeChainSDKError } from '@vechain/sdk-core/src';

describe('ThorestError', () => {
    describe('constructor', () => {
        test('ok <- default status', () => {
            const error = new ThorError('TestFQN', 'Test message');
            expect(error).toBeInstanceOf(ThorError);
            expect(error.fqn).toBe('TestFQN');
            expect(error.message).toBe('Test message');
            expect(error.status).toBe(0);
        });

        test('ok <- set status', () => {
            const error = new ThorError(
                'TestFQN',
                'Test message',
                undefined,
                undefined,
                404
            );
            expect(error).toBeInstanceOf(ThorError);
            expect(error.fqn).toBe('TestFQN');
            expect(error.message).toBe('Test message');
            expect(error.status).toBe(404);
        });

        test('ok <- with arguments', () => {
            const args = { key: 'value' };
            const error = new ThorError('TestFQN', 'Test message', args);
            expect(error.args).toEqual(args);
        });

        test('ok <- with a cause', () => {
            const cause = new Error('Underlying error');
            const error = new ThorError(
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
            const error = new ThorError('TestFQN', 'Test message');
            expect(error).toBeInstanceOf(VeChainSDKError);
        });
    });
});
