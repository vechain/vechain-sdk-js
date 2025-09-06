import { describe, expect, test } from '@jest/globals';
import { Address, HexUInt, Quantity } from '@common/vcdm';
import {
    Clause,
    type SponsoredTransactionRequest,
    TransactionRequest
} from '@thor/thorest/model';
import { PrivateKeySigner, RLPCodec } from '@thor/thorest/signer';
import { TEST_ACCOUNTS } from '../../../fixture';
import { IllegalArgumentError } from '@common';

const { TRANSACTION_SENDER, TRANSACTION_RECEIVER } = TEST_ACCOUNTS.TRANSACTION;

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

    const mockOrigin = new PrivateKeySigner(
        HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
    );

    const mockGasPayer = new PrivateKeySigner(
        HexUInt.of(TRANSACTION_RECEIVER.privateKey).bytes
    );

    const mockValue = Quantity.of(1000);

    describe('decode transaction request', () => {
        test('err <- invalid input', () => {
            const expected = mockGasPayer.sign(
                mockOrigin.sign(
                    new TransactionRequest({
                        blockRef: mockBlockRef,
                        chainTag: 1,
                        clauses: [
                            Clause.of({
                                to: TRANSACTION_RECEIVER.address,
                                value: mockValue.toString()
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

            const encoded = RLPCodec.encode(expected).slice(0);
            expect(() =>
                RLPCodec.decode(encoded.slice(0, encoded.length / 2))
            ).toThrow(IllegalArgumentError);
        });
    });

    describe('encode/decode', () => {
        test('ok <- non-sponsored signed transaction request', () => {
            const expected = mockOrigin.sign(
                new TransactionRequest({
                    blockRef: mockBlockRef,
                    chainTag: 1,
                    clauses: [
                        Clause.of({
                            to: TRANSACTION_RECEIVER.address,
                            value: mockValue.toString()
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
            expect(expected.origin.toString()).toEqual(
                mockOrigin.address.toString()
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
                        value: mockValue.toString()
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
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [
                    Clause.of({
                        to: TRANSACTION_RECEIVER.address,
                        value: mockValue.toString()
                    })
                ],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 3,
                isIntendedToBeSponsored: true
            });
            const expected = mockGasPayer.sign(
                mockOrigin.sign(txRequest)
            ) as SponsoredTransactionRequest;
            expect(expected.origin.toString()).toEqual(
                mockOrigin.address.toString()
            );
            expect(expected.gasPayer.toString()).toEqual(
                mockGasPayer.address.toString()
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
                        value: mockValue.toString()
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

    describe('encode/decode transaction request clauses', () => {
        test('ok <- handle transactions without clauses', () => {
            const expected = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 3
            });
            const actual = RLPCodec.decode(RLPCodec.encode(expected));
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- handle transaction without clause.data correctly', () => {
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [
                    Clause.of({
                        to: TRANSACTION_RECEIVER.address,
                        value: mockValue.toString()
                    })
                ],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 3
            });

            const actual = RLPCodec.decode(RLPCodec.encode(txRequest));
            expect(actual.toJSON()).toEqual(txRequest.toJSON());
        });

        test('ok <- handle transaction without clause.to correctly', () => {
            const expected = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [
                    Clause.of({
                        to: null,
                        value: mockValue.toString(),
                        data: '0xabcdef'
                    })
                ],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 3
            });

            const actual = RLPCodec.decode(RLPCodec.encode(expected));
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- handle transaction with optional clause properties correctly', () => {
            const expected = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [
                    new Clause(
                        Address.of(TRANSACTION_RECEIVER.address),
                        mockValue.bi,
                        HexUInt.of('0xabcdef'),
                        'test comment',
                        '0xabcdef'
                    )
                ],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 3
            });

            const actual = RLPCodec.decode(RLPCodec.encode(expected));
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- handle transaction with dependsOn correctly', () => {
            // Create a transaction request with dependsOn
            const expected = new TransactionRequest({
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
            const actual = RLPCodec.decode(RLPCodec.encode(expected));
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });
    });
});
