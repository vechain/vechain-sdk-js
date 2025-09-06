import { describe, expect, test } from '@jest/globals';
import { Address, Blake2b256, HexUInt, Quantity } from '@common/vcdm';
import {
    Clause,
    type SponsoredTransactionRequest,
    Transaction,
    type TransactionBody,
    type TransactionClause,
    TransactionRequest
} from '@thor/thorest/model';
import { PrivateKeySigner, RLPCodec } from '@thor/thorest/signer';
import { TEST_ACCOUNTS } from '../../../fixture';
import { IllegalArgumentError, Secp256k1 } from '@common';
import * as nc_utils from '@noble/curves/abstract/utils';

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

            const tx = Transaction.of(
                newTransactionBodyFromTransactionRequest(txRequest)
            ).signAsSenderAndGasPayer(
                HexUInt.of(TRANSACTION_SENDER.privateKey).bytes,
                HexUInt.of(TRANSACTION_RECEIVER.privateKey).bytes
            );

            expect(expected.origin.toString()).toEqual(tx.origin.toString());
            expect(expected.gasPayer.toString()).toEqual(
                tx.gasPayer.toString()
            );
            const originHash = Blake2b256.of(RLPCodec.encode(txRequest));
            const sponsorHash = Blake2b256.of(
                nc_utils.concatBytes(originHash.bytes, expected.origin.bytes)
            );
            const gasPayerPublicKey = Secp256k1.recover(
                sponsorHash.bytes,
                tx.gasPayerSignature as Uint8Array
            );

            const a = Address.ofPublicKey(gasPayerPublicKey);
            console.log('A ' + a.toString());
            expect(a.toString()).toEqual(expected.gasPayer.toString());

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
