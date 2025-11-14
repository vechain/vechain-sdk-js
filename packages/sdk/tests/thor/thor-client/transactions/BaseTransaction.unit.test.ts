import { Hex } from '@common/vcdm';
import { describe, expect, test } from '@jest/globals';
import { Transaction } from '@thor/thor-client/model';

/**
 * @group unit
 */
describe('BaseTransaction unit tests', () => {
    test('should decode a transaction request', () => {
        const rawTx = Hex.of(
            '0xf902d6819a8702288058b9af928202d0f90273e094d3ef28df6b553ed2fc47259e8134319cb1121a2a89364200111c48f8000080e094d3ef28df6b553ed2fc47259e8134319cb1121a2a89364200111c48f8000080e094d3ef28df6b553ed2fc47259e8134319cb1121a2a89364200111c48f8000080e094d3ef28df6b553ed2fc47259e8134319cb1121a2a89364200111c48f8000080e094d3ef28df6b553ed2fc47259e8134319cb1121a2a89364200111c48f8000080e094d3ef28df6b553ed2fc47259e8134319cb1121a2a89364200111c48f8000080e094d3ef28df6b553ed2fc47259e8134319cb1121a2a89364200111c48f8000080e094d3ef28df6b553ed2fc47259e8134319cb1121a2a89364200111c48f8000080e094d3ef28df6b553ed2fc47259e8134319cb1121a2a89364200111c48f8000080e094d3ef28df6b553ed2fc47259e8134319cb1121a2a89364200111c48f8000080e094d3ef28df6b553ed2fc47259e8134319cb1121a2a89364200111c48f8000080e094d3ef28df6b553ed2fc47259e8134319cb1121a2a89364200111c48f8000080e094d3ef28df6b553ed2fc47259e8134319cb1121a2a89364200111c48f8000080e094d3ef28df6b553ed2fc47259e8134319cb1121a2a89364200111c48f8000080e094d3ef28df6b553ed2fc47259e8134319cb1121a2a89364200111c48f8000080e094d3ef28df6b553ed2fc47259e8134319cb1121a2a89364200111c48f8000080e094d3ef28df6b553ed2fc47259e8134319cb1121a2a89364200111c48f8000080e094d3ef28df6b553ed2fc47259e8134319cb1121a2a89364200111c48f8000080e094d3ef28df6b553ed2fc47259e8134319cb1121a2a89364200111c48f800008001830616988088ff9198c817655decc0b841bd61e198f126adddb169eebf5cd3da25ae3a3f07102e574bcd1368440d1e307c4c47884364e2abc66ef6940c4953758dd1c57f8255025639702104ce83e9a3b501'
        );
        const transactionRequest = Transaction.decode(rawTx);
        expect(transactionRequest).toBeDefined();
        expect(transactionRequest.chainTag).toBe(154);
        expect(transactionRequest.blockRef.toString()).toBe(
            '0x0002288058b9af92'
        );
        expect(transactionRequest.expiration).toBe(720);
        expect(transactionRequest.clauses.length).toBe(19);
        expect(transactionRequest.gas).toBe(399000n);
        expect(transactionRequest.nonce.toString()).toBe(
            Hex.of('0xff9198c817655dec').toString()
        );
        expect(transactionRequest.gasPriceCoef).toBe(1n);
        expect(transactionRequest.dependsOn).toBeNull();
        expect(transactionRequest.maxFeePerGas).toBeUndefined();
        expect(transactionRequest.maxPriorityFeePerGas).toBeUndefined();
    });
});
