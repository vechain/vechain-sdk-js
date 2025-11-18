import { IllegalArgumentError } from '@common/errors/IllegalArgumentError';
import { Address } from '@common/vcdm';
import { describe, expect, test } from '@jest/globals';
import { Clause, ThorClient } from '@thor/thor-client';
import { type TransactionBodyOptions } from '@thor/thor-client/model/transactions/TransactionBodyOptions';

/**
 * @group unit
 */
describe('BuildTransactionBody UNIT tests', () => {
    test('should build a full non fee delegated legacy transaction request', async () => {
        const thorClient = ThorClient.at('http://localhost:8669');
        const clauses = [new Clause(Address.of('0x0'), 1n, null, null, null)];
        const bodyOptions: TransactionBodyOptions = {
            blockRef: '0x1234',
            chainTag: 1,
            expiration: 1,
            gasPriceCoef: 2,
            nonce: 9
        };
        const txRequest = await thorClient.transactions.buildTransactionBody(
            clauses,
            100000,
            bodyOptions
        );
        expect(txRequest).toBeDefined();
        expect(txRequest.blockRef.toString()).toBe('0x1234');
        expect(txRequest.chainTag).toBe(1);
        expect(txRequest.clauses).toHaveLength(1);
        expect(txRequest.expiration).toBe(1);
        expect(txRequest.gasPriceCoef).toBe(2n);
        expect(txRequest.nonce).toBe(9n);
        expect(txRequest.isIntendedToBeSponsored).toBe(false);
        expect(txRequest.maxFeePerGas).toBeUndefined();
        expect(txRequest.maxPriorityFeePerGas).toBeUndefined();
    });
    test('should build a full non fee delegated dynamic fee transaction request', async () => {
        const thorClient = ThorClient.at('http://localhost:8669');
        const clauses = [new Clause(Address.of('0x0'), 1n, null, null, null)];
        const bodyOptions: TransactionBodyOptions = {
            blockRef: '0x1234',
            chainTag: 1,
            expiration: 1,
            maxFeePerGas: 100000,
            maxPriorityFeePerGas: 100000,
            nonce: 9,
            gasSponsorRequester: '0x05b0f21cCcF4c6AAbcA8Fe90904f878BeE47938A'
        };
        const txRequest = await thorClient.transactions.buildTransactionBody(
            clauses,
            100000,
            bodyOptions
        );
        expect(txRequest).toBeDefined();
        expect(txRequest.blockRef.toString()).toBe('0x1234');
        expect(txRequest.chainTag).toBe(1);
        expect(txRequest.clauses).toHaveLength(1);
        expect(txRequest.expiration).toBe(1);
        expect(txRequest.gasPriceCoef).toBeUndefined();
        expect(txRequest.nonce).toBe(9n);
        expect(txRequest.isIntendedToBeSponsored).toBe(true);
        expect(txRequest.maxFeePerGas).toBe(100000n);
        expect(txRequest.maxPriorityFeePerGas).toBe(100000n);
    });
    test('should throw an error if an option is invalid', async () => {
        const thorClient = ThorClient.at('http://localhost:8669');
        const clauses = [new Clause(Address.of('0x0'), 1n, null, null, null)];
        const bodyOptions: TransactionBodyOptions = {
            blockRef: '0x1234',
            chainTag: 1,
            expiration: 1,
            maxFeePerGas: 100000,
            maxPriorityFeePerGas: 100000,
            nonce: 9,
            gasSponsorRequester: 'invalid_address' // invalid address
        };
        const txRequest = thorClient.transactions.buildTransactionBody(
            clauses,
            100000,
            bodyOptions
        );
        await expect(txRequest).rejects.toThrow(IllegalArgumentError);
    });
});
