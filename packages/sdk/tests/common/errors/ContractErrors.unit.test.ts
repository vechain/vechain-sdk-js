import { describe, expect, test } from '@jest/globals';
import {
    ContractCallError,
    InvalidTransactionField
} from '../../../src/common/errors';

/**
 * @group unit/errors
 */
describe('Contract Error Classes', () => {
    describe('ContractCallError', () => {
        test('Should create ContractCallError with basic parameters', () => {
            const fqn = 'Contract.testFunction';
            const message = 'Contract call failed';

            const error = new ContractCallError(fqn, message);

            expect(error).toBeInstanceOf(Error);
            expect(error.name).toBe('Error'); // VeChainSDKError sets name to 'Error'
            expect(error.message).toBe('Contract call failed'); // Message is passed as-is
            expect(error.fqn).toBe(fqn);
            expect(error.tag.length).toBeGreaterThan(0);
        });

        test('Should create ContractCallError with additional context', () => {
            const fqn = 'Contract.balanceOf';
            const message = 'Insufficient balance';
            const args = {
                account: '0x1234567890123456789012345678901234567890',
                amount: '1000'
            };

            const error = new ContractCallError(fqn, message, args);

            expect(error.message).toBe('Insufficient balance');
            expect(error.args).toEqual(args);
        });

        test('Should create ContractCallError with cause', () => {
            const fqn = 'Contract.transfer';
            const message = 'Transfer failed';
            const cause = new Error('Network timeout');

            const error = new ContractCallError(fqn, message, undefined, cause);

            expect(error.cause).toBe(cause);
        });

        test('Should have proper toString representation', () => {
            const fqn = 'Contract.testFunction';
            const message = 'Test error';

            const error = new ContractCallError(fqn, message);
            const stringRep = error.toString();

            expect(stringRep.length).toBeGreaterThan(0);
            expect(stringRep).toContain('Contract.testFunction');
            expect(stringRep).toContain('Test error');
        });
    });

    describe('InvalidTransactionField', () => {
        test('Should create InvalidTransactionField with basic parameters', () => {
            const context = 'Contract.transfer';
            const message = 'Invalid value field';

            const error = new InvalidTransactionField(context, message);

            expect(error).toBeInstanceOf(Error);
            expect(error.name).toBe('Error'); // VeChainSDKError sets name to 'Error'
            expect(error.message).toBe('Invalid value field'); // Message is passed as-is
            expect(error.fqn).toBe(context);
            expect(error.tag.length).toBeGreaterThan(0);
        });

        test('Should create InvalidTransactionField with additional context', () => {
            const context = 'Contract.deploy';
            const message = 'Missing required field';
            const args = {
                fieldName: 'bytecode',
                fieldType: 'string'
            };

            const error = new InvalidTransactionField(context, message, args);

            expect(error.message).toBe('Missing required field');
            expect(error.args).toEqual(args);
        });

        test('Should create InvalidTransactionField with cause', () => {
            const context = 'Contract.execute';
            const message = 'Validation failed';
            const cause = new Error('Type mismatch');

            const error = new InvalidTransactionField(
                context,
                message,
                undefined,
                cause
            );
            expect(error.cause).toBe(cause);
        });

        test('Should have proper toString representation', () => {
            const context = 'Contract.testFunction';
            const message = 'Test validation error';

            const error = new InvalidTransactionField(context, message);
            const stringRep = error.toString();

            expect(stringRep.length).toBeGreaterThan(0);
            expect(stringRep).toContain('Contract.testFunction');
            expect(stringRep).toContain('Test validation error');
        });
    });

    describe('Error Inheritance', () => {
        test('Both error classes should extend VeChainSDKError', () => {
            const contractError = new ContractCallError('test', 'message');
            const transactionError = new InvalidTransactionField(
                'test',
                'message'
            );
            // Both should have VeChainSDKError properties
            expect(contractError).toHaveProperty('fqn');
            expect(contractError).toHaveProperty('tag');
            expect(contractError).toHaveProperty('args');
            expect(contractError).toHaveProperty('cause');

            expect(transactionError).toHaveProperty('fqn');
            expect(transactionError).toHaveProperty('tag');
            expect(transactionError).toHaveProperty('args');
            expect(transactionError).toHaveProperty('cause');
        });

        test('Should maintain proper error chain', () => {
            const rootCause = new Error('Root cause');
            const contractError = new ContractCallError(
                'test',
                'message',
                undefined,
                rootCause
            );
            expect(contractError.cause).toBe(rootCause);
            // The stack should contain the cause information
            expect(contractError.stack).toBeDefined();
        });
    });
});
