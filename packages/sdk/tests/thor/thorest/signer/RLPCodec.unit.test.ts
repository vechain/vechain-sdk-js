import { describe, expect, test } from '@jest/globals';
import { Address, HexUInt } from '@common/vcdm';
import {
    Clause,
    SignedTransactionRequest,
    TransactionRequest
} from '@thor/thorest/model';
import {
    Transaction,
    type TransactionBody,
    type TransactionClause
} from '@thor/thorest/transactions/model';
import { PrivateKeySigner, RLPCodec } from '@thor/thorest/signer';
import { TEST_ACCOUNTS } from '../../../fixture';

const { TRANSACTION_SENDER, TRANSACTION_RECEIVER } = TEST_ACCOUNTS.TRANSACTION;

// Temporary until Transaction exists.
function newTransactionBodyFromTransactionRequest(
    txRequest: TransactionRequest
): TransactionBody {
    return {
        chainTag: txRequest.chainTag,
        blockRef: txRequest.blockRef.toString(),
        dependsOn: txRequest.dependsOn?.toString() ?? null,
        expiration: txRequest.expiration,
        clauses: txRequest.clauses.map((clause: Clause): TransactionClause => {
            return {
                to: clause.to?.toString() ?? null,
                value: clause.value,
                data: clause.data?.toString() ?? '0x',
                comment: clause.comment ?? undefined,
                abi: clause.abi ?? undefined
            } satisfies TransactionClause;
        }),
        gasPriceCoef: Number(txRequest.gasPriceCoef),
        gas: Number(txRequest.gas),
        nonce: txRequest.nonce,
        reserved: {
            features: txRequest.isIntendedToBeSponsored ? 1 : 0,
            unused: []
        }
    } satisfies TransactionBody;
}

// Temporary until Transaction exists.
export function newTransactionFromTransactionRequest(
    txRequest: TransactionRequest
): Transaction {
    return Transaction.of(newTransactionBodyFromTransactionRequest(txRequest));
}

/**
 * @group unit/thor/thorest/signer
 */
describe('RLPCodec', () => {
    // Test data setup
    const mockBlockRef = HexUInt.of('0x1234567890abcdef');
    const mockDependsOn = HexUInt.of(
        '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
    );
    const mockGas = 21000n;

    const mockSigner = new PrivateKeySigner(
        HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
    );

    const mockSponsor = new PrivateKeySigner(
        HexUInt.of(TRANSACTION_RECEIVER.privateKey).bytes
    );

    describe('decode', () => {
        test('ok <- non-sponsored signed transaction request', () => {
            const expected = mockSigner.sign(
                new TransactionRequest({
                    blockRef: mockBlockRef,
                    chainTag: 1,
                    clauses: [
                        Clause.of({
                            to: TRANSACTION_RECEIVER.address,
                            value: '1000'
                        })
                    ],
                    dependsOn: null,
                    expiration: 32,
                    gas: mockGas,
                    gasPriceCoef: 0n,
                    nonce: 3,
                    isIntendedToBeSponsored: false
                })
            );

            const encoded = RLPCodec.encode(expected);
            const actual = RLPCodec.decode(encoded);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- non-sponsored unsigned transaction request', () => {
            const expected = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [
                    Clause.of({
                        to: TRANSACTION_RECEIVER.address,
                        value: '1000'
                    })
                ],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 3,
                isIntendedToBeSponsored: false
            });
            const encoded = RLPCodec.encode(expected);
            const actual = RLPCodec.decode(encoded);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- sponsored signed transaction request', () => {
            const expected = mockSponsor.sign(
                mockSigner.sign(
                    new TransactionRequest({
                        blockRef: mockBlockRef,
                        chainTag: 1,
                        clauses: [
                            Clause.of({
                                to: TRANSACTION_RECEIVER.address,
                                value: '1000'
                            })
                        ],
                        dependsOn: null,
                        expiration: 32,
                        gas: mockGas,
                        gasPriceCoef: 0n,
                        nonce: 3,
                        isIntendedToBeSponsored: true
                    })
                )
            );

            const encoded = RLPCodec.encode(expected);
            const actual = RLPCodec.decode(encoded);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- sponsored unsigned transaction request', () => {
            const expected = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [
                    Clause.of({
                        to: TRANSACTION_RECEIVER.address,
                        value: '1000'
                    })
                ],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 3,
                isIntendedToBeSponsored: true
            });
            const encoded = RLPCodec.encode(expected);
            const actual = RLPCodec.decode(encoded);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });
    });

    describe('encodeTransactionRequest', () => {
        test('ok <- non-sponsored transaction request correctly', () => {
            // Create a simple transaction request
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 1,
                isIntendedToBeSponsored: false
            });

            // Call the method
            const actual = RLPCodec.encode(txRequest);

            // Assert actual
            expect(actual.length).toBeGreaterThan(0);

            // Temporary until Transaction exists.
            const expected =
                newTransactionFromTransactionRequest(txRequest).encode(false);
            expect(actual).toEqual(expected);
        });

        test('ok <- sponsored transaction request correctly', () => {
            // Create a simple sponsored transaction request
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 2,
                isIntendedToBeSponsored: true
            });

            // Call the method
            const actual = RLPCodec.encode(txRequest);

            // Assert actual
            expect(actual.length).toBeGreaterThan(0);

            // Temporary until Transaction exists.
            const expected =
                newTransactionFromTransactionRequest(txRequest).encode(false);
            expect(actual).toEqual(expected);
        });

        test('ok <- handle transaction without clause.data correctly', () => {
            // Create a transaction request with clauses
            const clause = new Clause(
                Address.of(TRANSACTION_RECEIVER.address),
                1000n,
                null,
                null,
                null
            );

            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [clause],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 3,
                isIntendedToBeSponsored: false
            });

            // Call the method
            const actual = RLPCodec.encode(txRequest);

            // Assert actual
            expect(actual.length).toBeGreaterThan(0);

            // Temporary until Transaction exists.
            const expected =
                newTransactionFromTransactionRequest(txRequest).encode(false);
            expect(actual).toEqual(expected);
        });

        test('ok <- handle transaction without clause.to correctly', () => {
            // Create a transaction request with clauses
            const clause = new Clause(
                null,
                1000n,
                HexUInt.of('0xabcdef'),
                null,
                null
            );

            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [clause],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 3,
                isIntendedToBeSponsored: false
            });

            // Call the method
            const actual = RLPCodec.encode(txRequest);

            // Assert actual
            expect(actual.length).toBeGreaterThan(0);

            // Temporary until Transaction exists.
            const expected =
                newTransactionFromTransactionRequest(txRequest).encode(false);
            expect(actual).toEqual(expected);
        });

        test('ok <- handle transaction without optional clauses correctly', () => {
            // Create a transaction request with clauses
            const clause = new Clause(
                Address.of(TRANSACTION_RECEIVER.address),
                1000n,
                HexUInt.of('0xabcdef'),
                'test comment',
                '0xabcdef'
            );

            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [clause],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 3,
                isIntendedToBeSponsored: false
            });

            // Call the method
            const actual = RLPCodec.encode(txRequest);

            // Assert actual
            expect(actual.length).toBeGreaterThan(0);

            // Temporary until Transaction exists.
            const expected =
                newTransactionFromTransactionRequest(txRequest).encode(false);
            expect(actual).toEqual(expected);
        });

        test('ok <- handle transaction with optional clauses correctly', () => {
            // Create a transaction request with clauses
            const clause = new Clause(
                Address.of(TRANSACTION_RECEIVER.address),
                1000n,
                HexUInt.of('0xabcdef'),
                'test comment',
                '0xabcdef'
            );

            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [clause],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 3,
                isIntendedToBeSponsored: false
            });

            // Call the method
            const actual = RLPCodec.encode(txRequest);

            // Assert actual
            expect(actual.length).toBeGreaterThan(0);

            // Temporary until Transaction exists.
            const expected =
                newTransactionFromTransactionRequest(txRequest).encode(false);
            expect(actual).toEqual(expected);
        });

        test('ok <- handle transaction with dependsOn correctly', () => {
            // Create a transaction request with dependsOn
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: mockDependsOn,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 4,
                isIntendedToBeSponsored: false
            });

            // Call the method
            const actual = RLPCodec.encode(txRequest);

            // Assert actual
            expect(actual.length).toBeGreaterThan(0);

            // Temporary until Transaction exists.
            const expected =
                newTransactionFromTransactionRequest(txRequest).encode(false);
            expect(actual).toEqual(expected);
        });
    });

    describe('encodeSignedTransactionRequest', () => {
        test('ok <- non-sponsored signed transaction request correctly', () => {
            const clause = new Clause(
                Address.of(TRANSACTION_RECEIVER.address),
                1000n,
                HexUInt.of('0xabcdef'),
                'test comment',
                '0xabcdef'
            );

            // Create a simple signed transaction request
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [clause, clause],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 5,
                isIntendedToBeSponsored: false
            });

            // Temporary until Transaction exists.
            const signedTx = newTransactionFromTransactionRequest(
                txRequest
            ).sign(HexUInt.of(TRANSACTION_SENDER.privateKey).bytes);
            const signedTxRequest = new SignedTransactionRequest({
                ...txRequest,
                origin: signedTx.origin,
                originSignature: signedTx.signature as Uint8Array,
                signature: signedTx.signature as Uint8Array
            });

            // Call the method
            const actual = RLPCodec.encode(signedTxRequest);

            // Assert actual
            expect(actual.length).toBeGreaterThan(0);

            // Temporary until Transaction exists.
            expect(actual).toEqual(signedTx.encode(true));
        });

        test('ok <- sponsored signed transaction request correctly', () => {
            const clause = new Clause(
                Address.of(TRANSACTION_RECEIVER.address),
                1000n,
                HexUInt.of('0xabcdef'),
                'test comment',
                '0xabcdef'
            );

            // Create a simple sponsored signed transaction request
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [clause, clause],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 6,
                isIntendedToBeSponsored: true
            });

            // Temporary until Transaction exists.
            const signedTx = newTransactionFromTransactionRequest(
                txRequest
            ).signAsSenderAndGasPayer(
                HexUInt.of(TRANSACTION_SENDER.privateKey).bytes,
                HexUInt.of(TRANSACTION_RECEIVER.privateKey).bytes
            );
            const signedTxRequest = new SignedTransactionRequest({
                ...txRequest,
                origin: signedTx.origin,
                originSignature: signedTx.signature as Uint8Array,
                signature: signedTx.signature as Uint8Array
            });

            // Call the method
            const actual = RLPCodec.encode(signedTxRequest);

            // Assert actual
            expect(actual.length).toBeGreaterThan(0);

            // Temporary until Transaction exists.
            expect(actual).toEqual(signedTx.encode(true));
        });
    });
});
