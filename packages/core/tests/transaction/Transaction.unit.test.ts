import { describe, expect } from '@jest/globals';
import {
    InvalidDataType,
    InvalidSecp256k1PrivateKey,
    InvalidSecp256k1Signature,
    InvalidTransactionField,
    NotDelegatedTransaction,
    UnavailableTransactionField
} from '@vechain/sdk-errors';
import {
    Address,
    HexUInt,
    Secp256k1,
    Transaction,
    type TransactionBody,
    type TransactionClause,
    Units,
    VTHO
} from '../../src';

const DelegatorPrivateKeyFix = HexUInt.of(
    '40de805e918403683fb9a6081c3fba072cdc5c88232c62a9509165122488dab7'
).bytes;

const DelegatorFix = {
    privateKey: DelegatorPrivateKeyFix,
    address: Address.ofPrivateKey(DelegatorPrivateKeyFix)
};

const SignerPrivateKeyFix = HexUInt.of(
    '7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a'
).bytes;

const SignerFix = {
    privateKey: SignerPrivateKeyFix,
    address: Address.ofPrivateKey(SignerPrivateKeyFix)
};

const IntrinsicGasFix = VTHO.of(37432n, Units.wei);

const TxBodyFix: TransactionBody = {
    chainTag: 1,
    blockRef: '0x00000000aabbccdd',
    expiration: 32,
    clauses: [
        {
            to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            value: 10000,
            data: '0x000000606060'
        },
        {
            to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            value: 20000,
            data: '0x000000606060'
        }
    ],
    gasPriceCoef: 128,
    gas: 21000,
    dependsOn: null,
    nonce: 12345678
};

const TransactionFixture = {
    invalidReservedFieldNotTrimmed: {
        encodedUnsigned: HexUInt.of(
            'f8560184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ec28080'
        ).bytes
    },
    undelegated: {
        body: TxBodyFix,
        transactionHash: HexUInt.of(
            '0x2a1c25ce0d66f45276a5f308b99bf410e2fc7d5b6ea37a49f2ab9f1da9446478'
        ),
        signedTransactionId: HexUInt.of(
            '0xda90eaea52980bc4bb8d40cb2ff84d78433b3b4a6e7d50b75736c5e3e77b71ec'
        ),
        encodedUnsigned: HexUInt.of(
            'f8540184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ec0'
        ).bytes,
        encodedSigned: HexUInt.of(
            'f8970184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ec0b841f76f3c91a834165872aa9464fc55b03a13f46ea8d3b858e528fcceaf371ad6884193c3f313ff8effbb57fe4d1adc13dceb933bedbf9dbb528d2936203d5511df00'
        ).bytes,
        intrinsicGas: IntrinsicGasFix
    },
    delegated: {
        body: {
            ...TxBodyFix,
            reserved: {
                features: 1
            }
        },
        transactionHash: HexUInt.of(
            '0x005fb0b47dfd16b7f2f61bb17df791242bc37ed1fffe9b05fa55fb0fe069f9a3'
        ),
        encodedUnsigned: HexUInt.of(
            'f8550184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ec101'
        ).bytes,
        encodedSigned: HexUInt.of(
            'f8d90184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ec101b8822cec617320e27c7ddd4058c048328ca7288914a4b9c9a663a0f7673b774b1f2c3e4366ddc5a03724ad9aad72c8805cb7972a927638eee40718e2eb4e580d322d0124a1817609f0971ff356b0252958f6c1d8a23b872a14ac1ccaad88c2ce8d3aa535cdfb1d538e557e63735ab86051ecc2f8c5d2aa1cddd4129a23cbced6ab294b00'
        ).bytes,
        signedTransactionId: HexUInt.of(
            '0xd4d1ae152119bd7c9410844e70b82d6d42c15494f1d59b99f5808a90da403a98'
        ),
        intrinsicGas: IntrinsicGasFix
    },
    delegatedWithUnusedFields: {
        body: {
            ...TxBodyFix,
            reserved: {
                features: 1,
                unused: [
                    // eslint-disable-next-line local-rules/disallow-buffer-from-alloc
                    Uint8Array.from(Buffer.from('0x000')),
                    // eslint-disable-next-line local-rules/disallow-buffer-from-alloc
                    Uint8Array.from(Buffer.from('0x000'))
                ]
            }
        },
        transactionHash: HexUInt.of(
            '0xd6e8f162e3e08585ee8fcf81868e5bd57a59966fef218528339766ee2587726c'
        ),
        encodedUnsigned: HexUInt.of(
            'f8610184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ecd01853078303030853078303030'
        ).bytes,
        encodedSigned: HexUInt.of(
            'f8e50184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ecd01853078303030853078303030b882ca99d0a802c1d4bf5841d80d6f22383a7e902916575fc70d360c4adb15937d631d321572ba9b22b3a23a9309db4fa1eeaf45d36a9defbd2c9e026126c865fd2c0021191568ba85aeb3aa1f02e07686a4c51af7b4bde4496ca8d2f9af3a28e43e20644d496751f6cfb953c5b5cb435d2b02e7b5efdab892ef4d0c8651797ce3401501'
        ).bytes,
        signedTransactionId: HexUInt.of(
            '0xd244b56d0ac6d05e6bb3c48867d3093e86414392d46e20f04ecaf026b6f8d20d'
        ),
        intrinsicGas: IntrinsicGasFix
    }
};

/**
 * Test Transaction class.
 * @group unit/transaction
 */
describe('Transaction class tests', () => {
    describe('Construction tests', () => {
        describe('of unsigned transactions', () => {
            test('Transaction <- of undelegated transactions', () => {
                const expected = TransactionFixture.undelegated;
                const actual = Transaction.of(expected.body);
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.signature).toBeUndefined();
                expect(actual.isSigned).toBe(false);
                expect(actual.isDelegated).toBe(false);
                expect(
                    actual
                        .getTransactionHash()
                        .isEqual(TransactionFixture.undelegated.transactionHash)
                ).toBe(true);
                expect(() => actual.id).toThrowError(
                    UnavailableTransactionField
                );
                expect(() => actual.origin).toThrowError(
                    UnavailableTransactionField
                );
                expect(() => actual.delegator).toThrowError(
                    NotDelegatedTransaction
                );
                expect(actual.encoded).toEqual(expected.encodedUnsigned);
                expect(actual.intrinsicGas.isEqual(expected.intrinsicGas)).toBe(
                    true
                );
            });

            test('Transaction <- of delegated transactions', () => {
                const expected = TransactionFixture.delegated;
                const actual = Transaction.of(expected.body);
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.isSigned).toBe(false);
                expect(actual.isDelegated).toEqual(true);
                expect(
                    actual
                        .getTransactionHash()
                        .isEqual(expected.transactionHash)
                ).toBe(true);
                expect(() => actual.id).toThrowError(
                    UnavailableTransactionField
                );
                expect(() => actual.origin).toThrowError(
                    UnavailableTransactionField
                );
                expect(() => actual.delegator).toThrowError(
                    UnavailableTransactionField
                );
                expect(actual.encoded).toEqual(expected.encodedUnsigned);
                expect(actual.intrinsicGas.isEqual(expected.intrinsicGas)).toBe(
                    true
                );
            });

            test('Transaction <- of delegated transactions with unused fields', () => {
                const expected = TransactionFixture.delegatedWithUnusedFields;
                const actual = Transaction.of(expected.body);
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.isSigned).toBe(false);
                expect(actual.isDelegated).toEqual(true);
                expect(
                    actual
                        .getTransactionHash()
                        .isEqual(expected.transactionHash)
                ).toBe(true);
                expect(() => actual.id).toThrowError(
                    UnavailableTransactionField
                );
                expect(() => actual.origin).toThrowError(
                    UnavailableTransactionField
                );
                expect(() => actual.delegator).toThrowError(
                    UnavailableTransactionField
                );
                expect(actual.encoded).toEqual(expected.encodedUnsigned);
                expect(actual.intrinsicGas.isEqual(expected.intrinsicGas)).toBe(
                    true
                );
            });
        });

        describe('of signed transactions', () => {
            test('Transaction <- of undelegated transactions', () => {
                const expected = TransactionFixture.undelegated;
                const actual = Transaction.of(expected.body).sign(
                    SignerFix.privateKey
                );
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.signature).toBeDefined();
                expect(actual.signature?.length).toBe(
                    Secp256k1.SIGNATURE_LENGTH
                );
                expect(actual.isSigned).toEqual(true);
                expect(actual.isDelegated).toEqual(false);
                expect(
                    actual
                        .getTransactionHash()
                        .isEqual(expected.transactionHash)
                ).toBe(true);
                expect(actual.origin.isEqual(SignerFix.address)).toBe(true);
                expect(() => actual.delegator).toThrowError(
                    NotDelegatedTransaction
                );
                expect(actual.id.isEqual(expected.signedTransactionId)).toBe(
                    true
                );
                expect(actual.encoded).toEqual(expected.encodedSigned);
            });

            test('Transaction <- of delegated transactions', () => {
                const expected = TransactionFixture.delegated;
                const actual = Transaction.of(expected.body).signWithDelegator(
                    SignerFix.privateKey,
                    DelegatorFix.privateKey
                );
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.signature).toBeDefined();
                expect(actual.signature?.length).toBe(
                    Secp256k1.SIGNATURE_LENGTH * 2
                );
                expect(actual.isSigned).toEqual(true);
                expect(actual.isDelegated).toEqual(true);
                expect(
                    actual
                        .getTransactionHash()
                        .isEqual(expected.transactionHash)
                ).toBe(true);
                expect(actual.origin.isEqual(SignerFix.address)).toBe(true);
                expect(actual.delegator.isEqual(DelegatorFix.address)).toBe(
                    true
                );
                expect(actual.id.isEqual(expected.signedTransactionId)).toBe(
                    true
                );
                expect(actual.encoded).toEqual(expected.encodedSigned);
            });

            test('Transaction <- of delegated transactions with unused fields', () => {
                const expected = TransactionFixture.delegatedWithUnusedFields;
                const actual = Transaction.of(expected.body).signWithDelegator(
                    SignerFix.privateKey,
                    DelegatorFix.privateKey
                );
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.signature).toBeDefined();
                expect(actual.signature?.length).toBe(
                    Secp256k1.SIGNATURE_LENGTH * 2
                );
                expect(actual.isSigned).toEqual(true);
                expect(actual.isDelegated).toEqual(true);
                expect(
                    actual
                        .getTransactionHash()
                        .isEqual(expected.transactionHash)
                ).toBe(true);
                expect(actual.origin.isEqual(SignerFix.address)).toBe(true);
                expect(actual.delegator.isEqual(DelegatorFix.address)).toBe(
                    true
                );
                expect(actual.id.isEqual(expected.signedTransactionId)).toBe(
                    true
                );
                expect(actual.encoded).toEqual(expected.encodedSigned);
            });
        });

        describe('Exceptions', () => {
            test('Throw <- of invalid signature', () => {
                expect(() =>
                    Transaction.of(
                        TransactionFixture.delegated.body,
                        HexUInt.of('0xBAAAAAAD').bytes
                    )
                ).toThrowError(InvalidSecp256k1Signature);
            });

            test('Throw <- of invalid body', () => {
                expect(() =>
                    Transaction.of({
                        ...TransactionFixture.delegated.body,
                        blockRef: '0xFEE1DEAD'
                    })
                ).toThrowError(InvalidTransactionField);
            });
        });
    });

    describe('decode method tests', () => {
        describe('decode undelegated', () => {
            test('Transaction <- decode undelegated unsigned', () => {
                const expected = TransactionFixture.undelegated;
                const actual = Transaction.decode(
                    expected.encodedUnsigned,
                    false
                );
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.body).toEqual(expected.body);
                expect(actual.signature).toBeUndefined();
                expect(() => actual.origin).toThrowError(
                    UnavailableTransactionField
                );
                expect(() => actual.delegator).toThrowError(
                    NotDelegatedTransaction
                );
                expect(actual.isDelegated).toBe(false);
                expect(() => actual.id).toThrowError(
                    UnavailableTransactionField
                );
                expect(actual.isSigned).toBe(false);
                expect(actual.getTransactionHash()).toBeDefined();
                expect(actual.encoded).toBeDefined();
                expect(actual.encoded).toEqual(expected.encodedUnsigned);
            });

            test('Transaction <- decode undelegated signed', () => {
                const expected = TransactionFixture.undelegated;
                const actual = Transaction.decode(expected.encodedSigned, true);
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.body).toEqual(expected.body);
                expect(() => actual.signature).toBeDefined();
                expect(actual.origin).toBeDefined();
                expect(() => actual.delegator).toThrowError(
                    NotDelegatedTransaction
                );
                expect(actual.isDelegated).toBe(false);
                expect(actual.id).toBeDefined();
                expect(actual.isSigned).toBe(true);
                expect(actual.getTransactionHash()).toBeDefined();
                expect(actual.encoded).toBeDefined();
                expect(actual.encoded).toEqual(expected.encodedSigned);
            });
        });

        describe('decode delegated', () => {
            test('Transaction <- decode delegated unsigned', () => {
                const expected = TransactionFixture.delegated;
                const actual = Transaction.decode(
                    expected.encodedUnsigned,
                    false
                );
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.body).toEqual(expected.body);
                expect(actual.signature).toBeUndefined();
                expect(() => actual.origin).toThrowError(
                    UnavailableTransactionField
                );
                expect(() => actual.delegator).toThrowError(
                    UnavailableTransactionField
                );
                expect(actual.isDelegated).toBe(true);
                expect(() => actual.id).toThrowError(
                    UnavailableTransactionField
                );
                expect(actual.isSigned).toBe(false);
                expect(actual.getTransactionHash()).toBeDefined();
                expect(actual.getTransactionHash().bytes.length).toBe(32);
                expect(actual.encoded).toBeDefined();
                expect(actual.encoded).toEqual(expected.encodedUnsigned);
            });

            test('Transaction <- decode delegated signed', () => {
                const expected = TransactionFixture.delegated;
                const actual = Transaction.decode(expected.encodedSigned, true);
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.body).toEqual(expected.body);
                expect(actual.signature).toBeDefined();
                expect(actual.origin).toBeDefined();
                expect(actual.origin.isEqual(SignerFix.address)).toBe(true);
                expect(actual.delegator).toBeDefined();
                expect(actual.delegator.isEqual(DelegatorFix.address)).toBe(
                    true
                );
                expect(actual.isDelegated).toBe(true);
                expect(actual.id).toBeDefined();
                expect(actual.isSigned).toBe(true);
                expect(actual.getTransactionHash()).toBeDefined();
                expect(actual.encoded).toBeDefined();
                expect(actual.encoded).toEqual(expected.encodedSigned);
                expect(actual.signature).toBeDefined();
                expect(actual.signature?.length).toBe(
                    Secp256k1.SIGNATURE_LENGTH * 2
                );
            });
        });

        describe('decode delegated with unused fields', () => {
            test('Transaction <- decode delegates with unused fields unsigned', () => {
                const expected = TransactionFixture.delegatedWithUnusedFields;
                const actual = Transaction.decode(
                    expected.encodedUnsigned,
                    false
                );
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.body).toEqual(expected.body);
                expect(actual.signature).toBeUndefined();
                expect(() => actual.origin).toThrowError(
                    UnavailableTransactionField
                );
                expect(() => actual.delegator).toThrowError(
                    UnavailableTransactionField
                );
                expect(actual.isDelegated).toBe(true);
                expect(() => actual.id).toThrowError(
                    UnavailableTransactionField
                );
                expect(actual.isSigned).toBe(false);
                expect(actual.getTransactionHash()).toBeDefined();
                expect(actual.getTransactionHash().bytes.length).toBe(32);
                expect(actual.encoded).toBeDefined();
                expect(actual.encoded).toEqual(expected.encodedUnsigned);
            });

            test('Transaction <- decode delegates with unused fields signed', () => {
                const expected = TransactionFixture.delegatedWithUnusedFields;
                const actual = Transaction.decode(expected.encodedSigned, true);
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.body).toEqual(expected.body);
                expect(actual.signature).toBeDefined();
                expect(actual.origin).toBeDefined();
                expect(actual.origin.isEqual(SignerFix.address)).toBe(true);
                expect(actual.delegator).toBeDefined();
                expect(actual.delegator.isEqual(DelegatorFix.address)).toBe(
                    true
                );
                expect(actual.isDelegated).toBe(true);
                expect(actual.id).toBeDefined();
                expect(actual.isSigned).toBe(true);
                expect(actual.getTransactionHash()).toBeDefined();
                expect(actual.encoded).toBeDefined();
                expect(actual.encoded).toEqual(expected.encodedSigned);
                expect(actual.signature).toBeDefined();
                expect(actual.signature?.length).toBe(
                    Secp256k1.SIGNATURE_LENGTH * 2
                );
            });
        });

        describe('Exceptions', () => {
            test('Throw <- decode invalid data', () => {
                // Not trimmed reserved field error
                expect(() =>
                    Transaction.decode(
                        TransactionFixture.invalidReservedFieldNotTrimmed
                            .encodedUnsigned,
                        false
                    )
                ).toThrowError(InvalidTransactionField);
            });
        });
    });

    describe('intrinsicGas method tests', () => {
        describe('intrinsicGas for clauses with smart-contract', () => {
            test('VTHO <- intrinsicGas with no data', () => {
                const clauses: TransactionClause[] = [
                    {
                        to: null,
                        value: 0,
                        data: ''
                    }
                ];
                const actual = Transaction.intrinsicGas(clauses);
                expect(actual.wei).toBe(
                    BigInt(
                        Transaction.GAS_CONSTANTS.CLAUSE_GAS_CONTRACT_CREATION +
                            Transaction.GAS_CONSTANTS.TX_GAS
                    )
                );
            });

            test('VTHO <- intrinsicGas with zeros data', () => {
                const times = 100;
                const clauses: TransactionClause[] = [
                    {
                        to: null,
                        value: 0,
                        data: '0x' + '00'.repeat(times)
                    }
                ];
                const actual = Transaction.intrinsicGas(clauses);
                expect(actual.wei).toBe(
                    Transaction.GAS_CONSTANTS.CLAUSE_GAS_CONTRACT_CREATION +
                        Transaction.GAS_CONSTANTS.TX_GAS +
                        Transaction.GAS_CONSTANTS.ZERO_GAS_DATA * BigInt(times)
                );
            });

            test('VTHO <- intrinsicGas with non-zeros data', () => {
                const times = 100;
                const clauses: TransactionClause[] = [
                    {
                        to: null,
                        value: 0,
                        data: '0x' + '10'.repeat(times)
                    }
                ];
                const actual = Transaction.intrinsicGas(clauses);
                expect(actual.wei).toBe(
                    Transaction.GAS_CONSTANTS.CLAUSE_GAS_CONTRACT_CREATION +
                        Transaction.GAS_CONSTANTS.TX_GAS +
                        Transaction.GAS_CONSTANTS.NON_ZERO_GAS_DATA *
                            BigInt(times)
                );
            });

            test('VTHO <- intrinsicGas with mixed data', () => {
                const times = 100;
                const clauses: TransactionClause[] = [
                    {
                        to: null,
                        value: 0,
                        data: '0x' + '00'.repeat(times) + '10'.repeat(times)
                    }
                ];
                const actual = Transaction.intrinsicGas(clauses);
                expect(actual.wei).toBe(
                    Transaction.GAS_CONSTANTS.CLAUSE_GAS_CONTRACT_CREATION +
                        Transaction.GAS_CONSTANTS.TX_GAS +
                        Transaction.GAS_CONSTANTS.ZERO_GAS_DATA *
                            BigInt(times) +
                        Transaction.GAS_CONSTANTS.NON_ZERO_GAS_DATA *
                            BigInt(times)
                );
            });
        });

        describe('intrinsicGas for clauses without smart-contract', () => {
            test('VTHO <- intrinsicGas with no clauses', () => {
                expect(Transaction.intrinsicGas([]).wei).toBe(
                    BigInt(
                        Transaction.GAS_CONSTANTS.TX_GAS +
                            Transaction.GAS_CONSTANTS.CLAUSE_GAS
                    )
                );
            });

            test('VTHO <- intrinsicGas with single clause', () => {
                const clauses: TransactionClause[] = [
                    {
                        to: '0x0000000000000000000000000000000000000000',
                        value: 0,
                        data: ''
                    }
                ];
                const actual = Transaction.intrinsicGas(clauses);
                expect(actual.wei).toBe(
                    BigInt(
                        Transaction.GAS_CONSTANTS.CLAUSE_GAS +
                            Transaction.GAS_CONSTANTS.TX_GAS
                    )
                );
            });

            test('VTHO <- intrinsicGas with multiple clauses', () => {
                const times = 5;
                const clauses: TransactionClause[] = Array(times).fill({
                    to: '0x0000000000000000000000000000000000000000',
                    value: 0,
                    data: ''
                }) as TransactionClause[];
                const actual = Transaction.intrinsicGas(clauses);
                expect(actual.wei).toBe(
                    Transaction.GAS_CONSTANTS.CLAUSE_GAS * BigInt(times) +
                        Transaction.GAS_CONSTANTS.TX_GAS
                );
            });
        });

        describe('Exceptions', () => {
            test('Throw <- invalid field', () => {
                const clauses: TransactionClause[] = [
                    {
                        to: 'INVALID ADDRESS',
                        value: 0,
                        data: ''
                    }
                ];
                expect(() => Transaction.intrinsicGas(clauses)).toThrowError(
                    InvalidDataType
                );
            });

            test('Throw <- invalid data content', () => {
                const clauses: TransactionClause[] = [
                    {
                        to: null,
                        value: 0,
                        data: 'INVALID DATA FORMAT'
                    }
                ];
                expect(() => Transaction.intrinsicGas(clauses)).toThrowError(
                    InvalidDataType
                );
            });
        });
    });

    describe('sign method tests', () => {
        test('signature <- undelegated', () => {
            const actual = Transaction.of(
                TransactionFixture.undelegated.body
            ).sign(SignerFix.privateKey);
            expect(actual.signature).toBeDefined();
            expect(actual.signature?.length).toBe(Secp256k1.SIGNATURE_LENGTH);
        });

        test('Throw <- delegated', () => {
            expect(() =>
                Transaction.of(TransactionFixture.delegated.body).sign(
                    SignerFix.privateKey
                )
            ).toThrowError(InvalidTransactionField);
        });

        test('Throw <- invalid private keys', () => {
            expect(() =>
                Transaction.of(TransactionFixture.undelegated.body).sign(
                    HexUInt.of('0xF00DBABE').bytes // https://en.wikipedia.org/wiki/Hexspeak
                )
            ).toThrowError(InvalidSecp256k1PrivateKey);
        });
    });

    describe('signAsDelegator method tests', () => {
        test('signature (complete) <- delegator', () => {
            const expected = Transaction.of(
                TransactionFixture.delegated.body
            ).signWithDelegator(SignerFix.privateKey, DelegatorFix.privateKey);
            const signed = Transaction.of(
                TransactionFixture.delegated.body
            ).signForDelegator(SignerFix.privateKey);
            const signer = Address.ofPrivateKey(SignerFix.privateKey);
            const actual = signed.signAsDelegator(
                signer,
                DelegatorFix.privateKey
            );
            expect(actual.signature).toEqual(expected.signature);
        });

        test('Throw <- undelegated', () => {
            expect(() => {
                Transaction.of(TransactionFixture.undelegated.body)
                    .sign(SignerFix.privateKey)
                    .signAsDelegator(
                        Address.ofPrivateKey(SignerFix.privateKey),
                        SignerFix.privateKey
                    );
            }).toThrowError(NotDelegatedTransaction);
        });

        test('Throw <- unsigned', () => {
            expect(() => {
                Transaction.of(
                    TransactionFixture.delegated.body
                ).signAsDelegator(
                    Address.ofPrivateKey(SignerFix.privateKey),
                    SignerFix.privateKey
                );
            }).toThrowError(InvalidTransactionField);
        });

        test('Throw <- invalid private keys - delegator', () => {
            expect(() =>
                Transaction.of(
                    TransactionFixture.undelegated.body
                ).signForDelegator(
                    HexUInt.of('0xF00DBABE').bytes // https://en.wikipedia.org/wiki/Hexspeak
                )
            ).toThrowError(InvalidSecp256k1PrivateKey);
        });
    });

    describe('signForDelegator method tests', () => {
        test('signature (incomplete) <- signed', () => {
            const expected = Transaction.of(
                TransactionFixture.delegated.body
            ).signWithDelegator(SignerFix.privateKey, DelegatorFix.privateKey);
            const actual = Transaction.of(
                TransactionFixture.delegated.body
            ).signForDelegator(SignerFix.privateKey);
            expect(actual.signature).toBeDefined(); // The signer's signature exists, but...
            // ... the delegator signature is missing, hence...
            expect(actual.isSigned).toBe(false); // ... the signature is incomplete.
            expect(actual.signature).toEqual(
                expected.signature?.slice(0, actual.signature?.length)
            );
        });

        test('Throw <- undelegated', () => {
            expect(() =>
                Transaction.of(
                    TransactionFixture.undelegated.body
                ).signForDelegator(SignerFix.privateKey)
            ).toThrowError(NotDelegatedTransaction);
        });

        test('Throw <- invalid private keys - signer', () => {
            expect(() =>
                Transaction.of(
                    TransactionFixture.undelegated.body
                ).signForDelegator(
                    HexUInt.of('0xF00DBABE').bytes // https://en.wikipedia.org/wiki/Hexspeak
                )
            ).toThrowError(InvalidSecp256k1PrivateKey);
        });
    });

    describe('signWithDelegator method tests', () => {
        test('signature <- delegated', () => {
            const actual = Transaction.of(
                TransactionFixture.delegated.body
            ).signWithDelegator(SignerFix.privateKey, DelegatorFix.privateKey);
            expect(actual.isDelegated).toBe(true);
            expect(actual.id).toBeDefined();
            expect(actual.signature).toBeDefined();
            expect(actual.signature?.length).toBe(
                Secp256k1.SIGNATURE_LENGTH * 2
            );
            expect(actual.origin.isEqual(SignerFix.address)).toBe(true);
            expect(actual.delegator.isEqual(DelegatorFix.address)).toBe(true);
        });

        test('Throw <- undelegated', () => {
            expect(() =>
                Transaction.of(
                    TransactionFixture.undelegated.body
                ).signWithDelegator(
                    SignerFix.privateKey,
                    DelegatorFix.privateKey
                )
            ).toThrowError(NotDelegatedTransaction);
        });

        test('Throw <- invalid private keys - signer', () => {
            expect(() =>
                Transaction.of(
                    TransactionFixture.undelegated.body
                ).signWithDelegator(
                    HexUInt.of('0xF00DBABE').bytes, // https://en.wikipedia.org/wiki/Hexspeak
                    DelegatorFix.privateKey
                )
            ).toThrowError(InvalidSecp256k1PrivateKey);
        });

        test('Throw <- invalid private keys - delegator', () => {
            expect(() => {
                Transaction.of(
                    TransactionFixture.undelegated.body
                ).signWithDelegator(
                    SignerFix.privateKey,
                    HexUInt.of('0xF00DBABE').bytes // https://en.wikipedia.org/wiki/Hexspeak
                );
            }).toThrowError(InvalidSecp256k1PrivateKey);
        });
    });
});

export { TransactionFixture };
