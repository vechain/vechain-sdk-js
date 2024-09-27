import { describe, expect } from '@jest/globals';
import {
    Address,
    HexUInt,
    Transaction,
    type TransactionBody,
    Units,
    VTHO
} from '../../src';
import {
    InvalidSecp256k1Signature,
    InvalidTransactionField,
    NotDelegatedTransaction,
    UnavailableTransactionField
} from '@vechain/sdk-errors';

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

const TxBodyFixture: TransactionBody = {
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

const TxFixture = {
    undelegated: {
        body: TxBodyFixture,
        signatureHash: HexUInt.of(
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
            ...TxBodyFixture,
            reserved: {
                features: 1
            }
        },
        signatureHash: HexUInt.of(
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
            ...TxBodyFixture,
            reserved: {
                features: 1,
                // todo: remove buffer once #1120 refactor encoding done
                unused: [Buffer.from('0x000'), Buffer.from('0x000')]
            }
        },
        signatureHash: HexUInt.of(
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
                const actual = Transaction.of(TxFixture.undelegated.body);
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.signature).toBeUndefined();
                expect(actual.isSigned).toBe(false);
                expect(actual.isDelegated).toBe(false);
                expect(
                    actual
                        .getSignatureHash()
                        .isEqual(TxFixture.undelegated.signatureHash)
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
                expect(actual.encoded).toEqual(
                    TxFixture.undelegated.encodedUnsigned
                );
                expect(
                    actual.intrinsicGas.isEqual(
                        TxFixture.undelegated.intrinsicGas
                    )
                ).toBe(true);
            });

            test('Transaction <- of delegated transactions', () => {
                const actual = Transaction.of(TxFixture.delegated.body);
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.isSigned).toBe(false);
                expect(actual.isDelegated).toEqual(true);
                expect(
                    actual
                        .getSignatureHash()
                        .isEqual(TxFixture.delegated.signatureHash)
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
                expect(actual.encoded).toEqual(
                    TxFixture.delegated.encodedUnsigned
                );
                expect(
                    actual.intrinsicGas.isEqual(
                        TxFixture.delegated.intrinsicGas
                    )
                ).toBe(true);
            });

            test('Transaction <- of delegated transactions with unused fields', () => {
                const actual = Transaction.of(
                    TxFixture.delegatedWithUnusedFields.body
                );
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.isSigned).toBe(false);
                expect(actual.isDelegated).toEqual(true);
                expect(
                    actual
                        .getSignatureHash()
                        .isEqual(
                            TxFixture.delegatedWithUnusedFields.signatureHash
                        )
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
                expect(actual.encoded).toEqual(
                    TxFixture.delegatedWithUnusedFields.encodedUnsigned
                );
                expect(
                    actual.intrinsicGas.isEqual(
                        TxFixture.delegatedWithUnusedFields.intrinsicGas
                    )
                ).toBe(true);
            });
        });

        describe('of signed transactions', () => {
            test('Transaction <- of undelegated transactions', () => {
                const actual = Transaction.of(TxFixture.undelegated.body).sign(
                    SignerFix.privateKey
                );
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.signature).toBeDefined();
                expect(actual.isSigned).toEqual(true);
                expect(actual.isDelegated).toEqual(false);
                expect(
                    actual
                        .getSignatureHash()
                        .isEqual(TxFixture.undelegated.signatureHash)
                ).toBe(true);
                expect(actual.origin.isEqual(SignerFix.address)).toBe(true);
                expect(() => actual.delegator).toThrowError(
                    NotDelegatedTransaction
                );
                expect(
                    actual.id.isEqual(TxFixture.undelegated.signedTransactionId)
                ).toBe(true);
                expect(actual.encoded).toEqual(
                    TxFixture.undelegated.encodedSigned
                );
            });

            test('Transaction <- of delegated transactions', () => {
                const actual = Transaction.of(
                    TxFixture.delegated.body
                ).signWithDelegator(
                    SignerFix.privateKey,
                    DelegatorFix.privateKey
                );
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.signature).toBeDefined();
                expect(actual.isSigned).toEqual(true);
                expect(actual.isDelegated).toEqual(true);
                expect(
                    actual
                        .getSignatureHash()
                        .isEqual(TxFixture.delegated.signatureHash)
                ).toBe(true);
                expect(actual.origin.isEqual(SignerFix.address)).toBe(true);
                expect(actual.delegator.isEqual(DelegatorFix.address)).toBe(
                    true
                );
                expect(
                    actual.id.isEqual(TxFixture.delegated.signedTransactionId)
                ).toBe(true);
                expect(actual.encoded).toEqual(
                    TxFixture.delegated.encodedSigned
                );
            });

            test('Transaction <- of delegated transactions with unused fields', () => {
                const actual = Transaction.of(
                    TxFixture.delegatedWithUnusedFields.body
                ).signWithDelegator(
                    SignerFix.privateKey,
                    DelegatorFix.privateKey
                );
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.signature).toBeDefined();
                expect(actual.isSigned).toEqual(true);
                expect(actual.isDelegated).toEqual(true);
                expect(
                    actual
                        .getSignatureHash()
                        .isEqual(
                            TxFixture.delegatedWithUnusedFields.signatureHash
                        )
                ).toBe(true);
                expect(actual.origin.isEqual(SignerFix.address)).toBe(true);
                expect(actual.delegator.isEqual(DelegatorFix.address)).toBe(
                    true
                );
                expect(
                    actual.id.isEqual(
                        TxFixture.delegatedWithUnusedFields.signedTransactionId
                    )
                ).toBe(true);
                expect(actual.encoded).toEqual(
                    TxFixture.delegatedWithUnusedFields.encodedSigned
                );
            });
        });

        describe('Exceptions', () => {
            test('Throw <- of invalid signature', () => {
                expect(() =>
                    Transaction.of(
                        TxFixture.delegated.body,
                        HexUInt.of('0xBAAAAAAD').bytes
                    )
                ).toThrowError(InvalidSecp256k1Signature);
            });

            test('Throw <- of invalid body', () => {
                expect(() =>
                    Transaction.of({
                        ...TxFixture.delegated.body,
                        blockRef: '0xFEE1DEAD'
                    })
                ).toThrowError(InvalidTransactionField);
            });
        });
    });
});
