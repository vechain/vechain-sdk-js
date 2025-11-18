import { Address } from '@common/vcdm';
import { describe, expect, test } from '@jest/globals';
import { Clause, ThorClient } from '@thor/thor-client';
import { type TransactionBodyOptions } from '@thor/thor-client/model/transactions/TransactionBodyOptions';

/**
 * @group solo
 */
describe('BuildTransactionBody SOLO tests', () => {
    test('should build a full non fee delegated legacy transaction request', async () => {
        const thorClient = ThorClient.at('http://localhost:8669');
        const clauses = [new Clause(Address.of('0x0'), 1n, null, null, null)];
        const bodyOptions: TransactionBodyOptions = {
            gasPriceCoef: 2
        };
        const txRequest = await thorClient.transactions.buildTransactionBody(
            clauses,
            100000,
            bodyOptions
        );
        expect(txRequest).toBeDefined();
        expect(txRequest.blockRef.toString()).toBeDefined();
        expect(txRequest.chainTag).toBeDefined();
        expect(txRequest.clauses).toHaveLength(1);
        expect(txRequest.expiration).toBeDefined();
        expect(txRequest.gasPriceCoef).toBe(2n);
        expect(txRequest.nonce).toBeDefined();
        expect(txRequest.isIntendedToBeSponsored).toBe(false);
        expect(txRequest.maxFeePerGas).toBeUndefined();
        expect(txRequest.maxPriorityFeePerGas).toBeUndefined();
    });
    test('should build a full fee delegated dynamic fee transaction request', async () => {
        const thorClient = ThorClient.at('http://localhost:8669');
        const clauses = [new Clause(Address.of('0x0'), 1n, null, null, null)];
        const bodyOptions: TransactionBodyOptions = {
            maxFeePerGas: 100000,
            maxPriorityFeePerGas: 100000,
            gasSponsorRequester: '0x05b0f21cCcF4c6AAbcA8Fe90904f878BeE47938A'
        };
        const txRequest = await thorClient.transactions.buildTransactionBody(
            clauses,
            100000,
            bodyOptions
        );
        expect(txRequest).toBeDefined();
        expect(txRequest.blockRef.toString()).toBeDefined();
        expect(txRequest.chainTag).toBeDefined();
        expect(txRequest.clauses).toHaveLength(1);
        expect(txRequest.expiration).toBeDefined();
        expect(txRequest.gasPriceCoef).toBeUndefined();
        expect(txRequest.nonce).toBeDefined();
        expect(txRequest.isIntendedToBeSponsored).toBe(true);
        expect(txRequest.maxFeePerGas).toBe(100000n);
        expect(txRequest.maxPriorityFeePerGas).toBe(100000n);
    });
    test('should build a full transaction request when no options are provided', async () => {
        const thorClient = ThorClient.at('http://localhost:8669');
        const clauses = [new Clause(Address.of('0x0'), 1n, null, null, null)];
        const txRequest = await thorClient.transactions.buildTransactionBody(
            clauses,
            100000
        );
        expect(txRequest).toBeDefined();
        expect(txRequest.blockRef.toString()).toBeDefined();
        expect(txRequest.chainTag).toBeDefined();
        expect(txRequest.clauses).toHaveLength(1);
        expect(txRequest.expiration).toBeDefined();
        expect(txRequest.gasPriceCoef).toBeUndefined();
        expect(txRequest.nonce).toBeDefined();
        expect(txRequest.isIntendedToBeSponsored).toBe(false);
        expect(txRequest.maxFeePerGas).toBeGreaterThan(0n);
        expect(txRequest.maxPriorityFeePerGas).toBeGreaterThan(0n);
    });
});
