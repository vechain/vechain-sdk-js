import { describe, expect } from '@jest/globals';
import {
    InvalidDataType,
    InvalidSecp256k1PrivateKey,
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
    VTHO,
    ZERO_ADDRESS
} from '../../src';

const GasPayerPrivateKeyFix = HexUInt.of(
    '40de805e918403683fb9a6081c3fba072cdc5c88232c62a9509165122488dab7'
).bytes;

const GasPayerFix = {
    privateKey: GasPayerPrivateKeyFix,
    address: Address.ofPrivateKey(GasPayerPrivateKeyFix)
};

const SignerPrivateKeyFix = HexUInt.of(
    '7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a'
).bytes;

const SignerFix = {
    privateKey: SignerPrivateKeyFix,
    address: Address.ofPrivateKey(SignerPrivateKeyFix)
};

const IntrinsicGasFix = VTHO.of(37432n, Units.wei);

// Legacy transaction body
const TxLegacyBodyFix: TransactionBody = {
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

// EIP-1559 transaction body
const TxEIP1559BodyFix: TransactionBody = {
    ...TxLegacyBodyFix,
    gasPriceCoef: undefined,
    maxFeePerGas: 10000000000000,
    maxPriorityFeePerGas: 1000000
};

const LegacyTransactionFixture = {
    invalidReservedFieldNotTrimmed: {
        encodedUnsigned: HexUInt.of(
            'f8560184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ec28080'
        ).bytes
    },
    undelegated: {
        body: TxLegacyBodyFix,
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
            ...TxLegacyBodyFix,
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
            ...TxLegacyBodyFix,
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
describe('Transaction class Legacy tests', () => {
    describe('Construction tests', () => {
        describe('of unsigned transactions', () => {
            test('Transaction <- of undelegated transactions', () => {
                const expected = LegacyTransactionFixture.undelegated;
                const actual = Transaction.of(expected.body);
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.signature).toBeUndefined();
                expect(actual.isSigned).toBe(false);
                expect(actual.isDelegated).toBe(false);
                expect(
                    actual
                        .getTransactionHash()
                        .isEqual(
                            LegacyTransactionFixture.undelegated.transactionHash
                        )
                ).toBe(true);
                expect(() => actual.id).toThrowError(
                    UnavailableTransactionField
                );
                expect(() => actual.origin).toThrowError(
                    UnavailableTransactionField
                );
                expect(() => actual.gasPayer).toThrowError(
                    NotDelegatedTransaction
                );
                expect(actual.encoded).toEqual(expected.encodedUnsigned);
                expect(actual.intrinsicGas.isEqual(expected.intrinsicGas)).toBe(
                    true
                );
            });

            test('Transaction <- of delegated transactions', () => {
                const expected = LegacyTransactionFixture.delegated;
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
                expect(() => actual.gasPayer).toThrowError(
                    UnavailableTransactionField
                );
                expect(actual.encoded).toEqual(expected.encodedUnsigned);
                expect(actual.intrinsicGas.isEqual(expected.intrinsicGas)).toBe(
                    true
                );
            });

            test('Transaction <- of delegated transactions with unused fields', () => {
                const expected =
                    LegacyTransactionFixture.delegatedWithUnusedFields;
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
                expect(() => actual.gasPayer).toThrowError(
                    UnavailableTransactionField
                );
                expect(actual.encoded).toEqual(expected.encodedUnsigned);
                expect(actual.intrinsicGas.isEqual(expected.intrinsicGas)).toBe(
                    true
                );
            });

            test('Transaction <- of delegated transactions simulating partial signed transmission between two different JS runtimes.', () => {
                const signed = Transaction.of(
                    LegacyTransactionFixture.delegated.body
                ).signAsSender(SignerFix.privateKey);

                const reconstructed = Transaction.of(
                    signed.body,
                    signed.signature
                );
                expect(reconstructed.signature).toBeDefined();
                expect(reconstructed.isDelegated).toBe(true);
                expect(reconstructed.isSigned).toBe(false);

                const signer = Address.ofPrivateKey(SignerFix.privateKey);
                const actual = signed.signAsGasPayer(
                    signer,
                    GasPayerFix.privateKey
                );
                expect(actual.isDelegated).toBe(true);
                expect(actual.isSigned).toBe(true);
                const expected =
                    LegacyTransactionFixture.delegated.encodedSigned;
                expect(actual.encoded).toEqual(expected);
            });
        });

        describe('of signed transactions', () => {
            test('Transaction <- of undelegated transactions', () => {
                const expected = LegacyTransactionFixture.undelegated;
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
                expect(() => actual.gasPayer).toThrowError(
                    NotDelegatedTransaction
                );
                expect(actual.id.isEqual(expected.signedTransactionId)).toBe(
                    true
                );
                expect(actual.encoded).toEqual(expected.encodedSigned);
            });

            test('Transaction <- of delegated transactions', () => {
                const expected = LegacyTransactionFixture.delegated;
                const actual = Transaction.of(
                    expected.body
                ).signAsSenderAndGasPayer(
                    SignerFix.privateKey,
                    GasPayerFix.privateKey
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
                expect(actual.gasPayer.isEqual(GasPayerFix.address)).toBe(true);
                expect(actual.id.isEqual(expected.signedTransactionId)).toBe(
                    true
                );
                expect(actual.encoded).toEqual(expected.encodedSigned);
            });

            test('Transaction <- of delegated transactions with unused fields', () => {
                const expected =
                    LegacyTransactionFixture.delegatedWithUnusedFields;
                const actual = Transaction.of(
                    expected.body
                ).signAsSenderAndGasPayer(
                    SignerFix.privateKey,
                    GasPayerFix.privateKey
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
                expect(actual.gasPayer.isEqual(GasPayerFix.address)).toBe(true);
                expect(actual.id.isEqual(expected.signedTransactionId)).toBe(
                    true
                );
                expect(actual.encoded).toEqual(expected.encodedSigned);
            });
        });

        describe('Exceptions', () => {
            test('Throw <- of invalid body', () => {
                expect(() =>
                    Transaction.of({
                        ...LegacyTransactionFixture.delegated.body,
                        blockRef: '0xFEE1DEAD'
                    })
                ).toThrowError(InvalidTransactionField);
            });
        });
    });

    describe('decode method tests', () => {
        describe('decode undelegated', () => {
            test('Transaction <- decode undelegated unsigned', () => {
                const expected = LegacyTransactionFixture.undelegated;
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
                expect(() => actual.gasPayer).toThrowError(
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
                const expected = LegacyTransactionFixture.undelegated;
                const actual = Transaction.decode(expected.encodedSigned, true);
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.body).toEqual(expected.body);
                expect(() => actual.signature).toBeDefined();
                expect(actual.origin).toBeDefined();
                expect(() => actual.gasPayer).toThrowError(
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
                const expected = LegacyTransactionFixture.delegated;
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
                expect(() => actual.gasPayer).toThrowError(
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
                const expected = LegacyTransactionFixture.delegated;
                const actual = Transaction.decode(expected.encodedSigned, true);
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.body).toEqual(expected.body);
                expect(actual.signature).toBeDefined();
                expect(actual.origin).toBeDefined();
                expect(actual.origin.isEqual(SignerFix.address)).toBe(true);
                expect(actual.gasPayer).toBeDefined();
                expect(actual.gasPayer.isEqual(GasPayerFix.address)).toBe(true);
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
                const expected =
                    LegacyTransactionFixture.delegatedWithUnusedFields;
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
                expect(() => actual.gasPayer).toThrowError(
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
                const expected =
                    LegacyTransactionFixture.delegatedWithUnusedFields;
                const actual = Transaction.decode(expected.encodedSigned, true);
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.body).toEqual(expected.body);
                expect(actual.signature).toBeDefined();
                expect(actual.origin).toBeDefined();
                expect(actual.origin.isEqual(SignerFix.address)).toBe(true);
                expect(actual.gasPayer).toBeDefined();
                expect(actual.gasPayer.isEqual(GasPayerFix.address)).toBe(true);
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
                        LegacyTransactionFixture.invalidReservedFieldNotTrimmed
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
        test('signature <- undelegated tx', () => {
            const actual = Transaction.of(
                LegacyTransactionFixture.undelegated.body
            ).sign(SignerFix.privateKey);
            expect(actual.signature).toBeDefined();
            expect(actual.signature?.length).toBe(Secp256k1.SIGNATURE_LENGTH);
        });

        test('Throw <- delegated tx', () => {
            expect(() =>
                Transaction.of(LegacyTransactionFixture.delegated.body).sign(
                    SignerFix.privateKey
                )
            ).toThrowError(InvalidTransactionField);
        });

        test('Throw <- invalid private keys', () => {
            expect(() =>
                Transaction.of(LegacyTransactionFixture.undelegated.body).sign(
                    HexUInt.of('0xF00DBABE').bytes // https://en.wikipedia.org/wiki/Hexspeak
                )
            ).toThrowError(InvalidSecp256k1PrivateKey);
        });
    });

    describe('signAsGasPayer method tests', () => {
        test('signature (complete) <- delegated tx', () => {
            const expected = Transaction.of(
                LegacyTransactionFixture.delegated.body
            ).signAsSenderAndGasPayer(
                SignerFix.privateKey,
                GasPayerFix.privateKey
            );
            const signed = Transaction.of(
                LegacyTransactionFixture.delegated.body
            ).signAsSender(SignerFix.privateKey);
            const signer = Address.ofPrivateKey(SignerFix.privateKey);
            const actual = signed.signAsGasPayer(
                signer,
                GasPayerFix.privateKey
            );
            expect(actual.signature).toEqual(expected.signature);
        });

        test('Throw <- undelegated tx', () => {
            expect(() => {
                Transaction.of(LegacyTransactionFixture.undelegated.body)
                    .sign(SignerFix.privateKey)
                    .signAsGasPayer(
                        Address.ofPrivateKey(SignerFix.privateKey),
                        SignerFix.privateKey
                    );
            }).toThrowError(NotDelegatedTransaction);
        });

        test('signature (only of the gasPayer) <- unsigned tx', () => {
            expect(
                (
                    Transaction.of(
                        LegacyTransactionFixture.delegated.body
                    ).signAsGasPayer(
                        Address.ofPrivateKey(SignerFix.privateKey),
                        SignerFix.privateKey
                    ).signature as Uint8Array
                ).length
            ).toBe(65);
        });

        test('Throw <- invalid private keys - delegated tx', () => {
            expect(() =>
                Transaction.of(
                    LegacyTransactionFixture.undelegated.body
                ).signAsSender(
                    HexUInt.of('0xF00DBABE').bytes // https://en.wikipedia.org/wiki/Hexspeak
                )
            ).toThrowError(InvalidSecp256k1PrivateKey);
        });
    });

    describe('signAsSender method tests', () => {
        test('signature (incomplete) <- signed', () => {
            const expected = Transaction.of(
                LegacyTransactionFixture.delegated.body
            ).signAsSenderAndGasPayer(
                SignerFix.privateKey,
                GasPayerFix.privateKey
            );
            const actual = Transaction.of(
                LegacyTransactionFixture.delegated.body
            ).signAsSender(SignerFix.privateKey);
            expect(actual.signature).toBeDefined(); // The signer's signature exists, but...
            // ... the gasPayer signature is missing, hence...
            expect(actual.isSigned).toBe(false); // ... the signature is incomplete.
            expect(actual.signature).toEqual(
                expected.signature?.slice(0, actual.signature?.length)
            );
        });

        test('Throw <- undelegated tx', () => {
            expect(() =>
                Transaction.of(
                    LegacyTransactionFixture.undelegated.body
                ).signAsSender(SignerFix.privateKey)
            ).toThrowError(NotDelegatedTransaction);
        });

        test('Throw <- invalid private keys - signer', () => {
            expect(() =>
                Transaction.of(
                    LegacyTransactionFixture.undelegated.body
                ).signAsSender(
                    HexUInt.of('0xF00DBABE').bytes // https://en.wikipedia.org/wiki/Hexspeak
                )
            ).toThrowError(InvalidSecp256k1PrivateKey);
        });
    });

    describe('signAsSenderAndGasPayer method tests', () => {
        test('signature <- delegated tx', () => {
            const actual = Transaction.of(
                LegacyTransactionFixture.delegated.body
            ).signAsSenderAndGasPayer(
                SignerFix.privateKey,
                GasPayerFix.privateKey
            );
            expect(actual.isDelegated).toBe(true);
            expect(actual.id).toBeDefined();
            expect(actual.signature).toBeDefined();
            expect(actual.signature?.length).toBe(
                Secp256k1.SIGNATURE_LENGTH * 2
            );
            expect(actual.origin.isEqual(SignerFix.address)).toBe(true);
            expect(actual.gasPayer.isEqual(GasPayerFix.address)).toBe(true);
        });

        test('Throw <- undelegated tx', () => {
            expect(() =>
                Transaction.of(
                    LegacyTransactionFixture.undelegated.body
                ).signAsSenderAndGasPayer(
                    SignerFix.privateKey,
                    GasPayerFix.privateKey
                )
            ).toThrowError(NotDelegatedTransaction);
        });

        test('Throw <- invalid private keys - signer', () => {
            expect(() =>
                Transaction.of(
                    LegacyTransactionFixture.undelegated.body
                ).signAsSenderAndGasPayer(
                    HexUInt.of('0xF00DBABE').bytes, // https://en.wikipedia.org/wiki/Hexspeak
                    GasPayerFix.privateKey
                )
            ).toThrowError(InvalidSecp256k1PrivateKey);
        });

        test('Throw <- invalid private keys - delegated tx', () => {
            expect(() => {
                Transaction.of(
                    LegacyTransactionFixture.undelegated.body
                ).signAsSenderAndGasPayer(
                    SignerFix.privateKey,
                    HexUInt.of('0xF00DBABE').bytes // https://en.wikipedia.org/wiki/Hexspeak
                );
            }).toThrowError(InvalidSecp256k1PrivateKey);
        });
    });
});

describe('Transaction class EIP-1559 tests', () => {
    test('encode/decode <- unsigned EIP-1559 tx', () => {
        const tx = Transaction.of(TxEIP1559BodyFix);
        const encoded = tx.encoded;
        const decoded = Transaction.decode(encoded, false);
        expect(decoded).toEqual(tx);
    });

    test('encode/decode <- signed EIP-1559 tx', () => {
        const tx = Transaction.of(TxEIP1559BodyFix).sign(SignerFix.privateKey);
        const encoded = tx.encoded;
        const decoded = Transaction.decode(encoded, true);
        expect(decoded).toEqual(tx);
        expect(decoded.isSigned).toBe(true);
    });

    test('exception <- maxPriorityFeePerGas field not specified', () => {
        const clauses = [
            {
                to: ZERO_ADDRESS,
                value: 1,
                data: '0x'
            }
        ];
        // Create transaction body without maxPriorityFeePerGas
        const transactionBodyWithoutMaxPriorityFeePerGas = {
            chainTag: 0xf6,
            blockRef: '0x1234567890',
            latestBlock: '0x0',
            expiration: 32,
            clauses,
            gas: 21000,
            maxFeePerGas: 10000000000000,
            dependsOn: null,
            nonce: 12345677
        };
        expect(() =>
            Transaction.of(transactionBodyWithoutMaxPriorityFeePerGas)
        ).toThrowError(InvalidTransactionField);
    });

    test('exception <- maxFeePerGas field not specified', () => {
        const clauses = [
            {
                to: ZERO_ADDRESS,
                value: 1,
                data: '0x'
            }
        ];
        // Create transaction body without maxFeePerGas
        const transactionBodyWithoutMaxPriorityFeePerGas = {
            chainTag: 0xf6,
            blockRef: '0x1234567890',
            latestBlock: '0x0',
            expiration: 32,
            clauses,
            gas: 21000,
            maxPriorityFeePerGas: 10000000000000,
            dependsOn: null,
            nonce: 12345677
        };
        expect(() =>
            Transaction.of(transactionBodyWithoutMaxPriorityFeePerGas)
        ).toThrowError(InvalidTransactionField);
    });
});

describe('Transaction validation', () => {
    test('Should reject transactions with both legacy and EIP-1559 parameters', () => {
        // Create a transaction body with both parameter types
        const mixedBody: TransactionBody = {
            ...TxLegacyBodyFix,
            maxFeePerGas: 10000000000000
            // maxPriorityFeePerGas: 1000000
        };

        // Should throw InvalidTransactionField when using Transaction.of
        expect(() => Transaction.of(mixedBody)).toThrow(
            InvalidTransactionField
        );
    });
});

describe('Transaction parameter validation', () => {
    test('Should accept valid legacy transactions', () => {
        // Only legacy params
        const legacyBody: TransactionBody = {
            ...TxLegacyBodyFix
        };

        // Should not throw error
        expect(() => Transaction.of(legacyBody)).not.toThrow();
    });

    test('Should accept valid EIP-1559 transactions', () => {
        // Only EIP-1559 params
        const eip1559Body: TransactionBody = {
            ...TxEIP1559BodyFix
        };

        // Should not throw error
        expect(() => Transaction.of(eip1559Body)).not.toThrow();
    });

    test('Should reject legacy transactions with maxFeePerGas', () => {
        // Legacy with one EIP-1559 param
        const mixedBody: TransactionBody = {
            ...TxLegacyBodyFix,
            maxFeePerGas: 10000000000000
        };

        // Should throw error
        expect(() => Transaction.of(mixedBody)).toThrow(
            InvalidTransactionField
        );
    });

    test('Should reject legacy transactions with maxPriorityFeePerGas', () => {
        // Legacy with the other EIP-1559 param
        const mixedBody: TransactionBody = {
            ...TxLegacyBodyFix,
            maxPriorityFeePerGas: 1000000
        };

        // Should throw error
        expect(() => Transaction.of(mixedBody)).toThrow(
            InvalidTransactionField
        );
    });

    test('Should reject EIP-1559 transactions with gasPriceCoef', () => {
        // EIP-1559 with legacy param
        const mixedBody: TransactionBody = {
            ...TxEIP1559BodyFix,
            gasPriceCoef: 128
        };

        // Should throw error
        expect(() => Transaction.of(mixedBody)).toThrow(
            InvalidTransactionField
        );
    });
});

export { LegacyTransactionFixture as TransactionFixture };
