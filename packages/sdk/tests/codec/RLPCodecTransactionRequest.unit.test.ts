// RLPCodecTransactionRequest.test.ts
import { RLPCodecTransactionRequest } from '@codec/RLPCodecTransactionRequest';
import { TransactionRequest } from './TransactionRequest';

describe('RLPCodecTransactionRequest', () => {
    describe('encode', () => {
        it('should correctly encode a valid transaction request', () => {
            const transactionRequest = new TransactionRequest(
                '0xdeadbeef', // blockRef
                42, // chainTag
                [
                    {
                        to: '0x000000000000000000000000000000000000dead',
                        value: 1000n,
                        data: '0xbeef'
                    }
                ], // clauses
                3600, // expiration
                21000n, // gas
                1n, // gasPriceCoef
                123, // nonce
                null // dependsOn
            );

            const encoded = RLPCodecTransactionRequest.encode(transactionRequest);

            expect(encoded).toBeInstanceOf(Uint8Array);
            // Add additional assertions here based on the expected encoded value
        });

        it('should correctly handle transaction request with null "to" clause', () => {
            const transactionRequest = new TransactionRequest(
                '0xdeadbeef', // blockRef
                42, // chainTag
                [
                    {
                        to: null,
                        value: 5000n,
                        data: '0xdeadc0de'
                    }
                ], // clauses
                7200, // expiration
                30000n, // gas
                2n, // gasPriceCoef
                456, // nonce
                null // dependsOn
            );

            const encoded = RLPCodecTransactionRequest.encode(transactionRequest);

            expect(encoded).toBeInstanceOf(Uint8Array);
            // Add additional assertions here based on the expected encoded value
        });

        it('should correctly encode transaction request with empty clauses', () => {
            const transactionRequest = new TransactionRequest(
                '0xcafebabe', // blockRef
                1, // chainTag
                [], // clauses
                1800, // expiration
                15000n, // gas
                1n, // gasPriceCoef
                789, // nonce
                '0xabcdef' // dependsOn
            );

            const encoded = RLPCodecTransactionRequest.encode(transactionRequest);

            expect(encoded).toBeInstanceOf(Uint8Array);
            // Add additional assertions here based on the expected encoded value
        });
    });
});
