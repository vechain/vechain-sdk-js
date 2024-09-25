import { describe, expect } from '@jest/globals';
import {
    HexUInt,
    Transaction,
    type TransactionBody,
    Units,
    VTHO
} from '../../src';
import {
    NotDelegatedTransaction,
    UnavailableTransactionField
} from '@vechain/sdk-errors';

/**
 * Simple correct transaction body fixture
 */
const TransactionBodyFixture: TransactionBody = {
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
    undelegated: {
        body: TransactionBodyFixture,
        signatureHashExpected: HexUInt.of(
            '0x2a1c25ce0d66f45276a5f308b99bf410e2fc7d5b6ea37a49f2ab9f1da9446478'
        ).bytes,
        signedTransactionIdExpected:
            '0xda90eaea52980bc4bb8d40cb2ff84d78433b3b4a6e7d50b75736c5e3e77b71ec',
        encodedUnsigned: HexUInt.of(
            'f8540184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ec0'
        ).bytes,
        encodedSigne: HexUInt.of(
            'f8970184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ec0b841f76f3c91a834165872aa9464fc55b03a13f46ea8d3b858e528fcceaf371ad6884193c3f313ff8effbb57fe4d1adc13dceb933bedbf9dbb528d2936203d5511df00'
        ).bytes,
        intrinsicGas: VTHO.of(37432, Units.wei)
    },
    delegated: {
        body: {
            ...TransactionBodyFixture,
            reserved: {
                features: 1
            }
        },
        signatureHashExpected:
            '0x005fb0b47dfd16b7f2f61bb17df791242bc37ed1fffe9b05fa55fb0fe069f9a3',
        encodedUnsignedExpected: Buffer.from(
            'f8550184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ec101',
            'hex'
        ),
        encodedSignedExpected: Buffer.from(
            'f8d90184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ec101b8822cec617320e27c7ddd4058c048328ca7288914a4b9c9a663a0f7673b774b1f2c3e4366ddc5a03724ad9aad72c8805cb7972a927638eee40718e2eb4e580d322d0124a1817609f0971ff356b0252958f6c1d8a23b872a14ac1ccaad88c2ce8d3aa535cdfb1d538e557e63735ab86051ecc2f8c5d2aa1cddd4129a23cbced6ab294b00',
            'hex'
        ),
        signedTransactionIdExpected:
            '0xd4d1ae152119bd7c9410844e70b82d6d42c15494f1d59b99f5808a90da403a98'
    },
    delegatedWithUnusedFields: {
        body: {
            ...TransactionBodyFixture,
            reserved: {
                features: 1,
                unused: [Buffer.from('0x000'), Buffer.from('0x000')]
            }
        },
        signatureHashExpected:
            '0xd6e8f162e3e08585ee8fcf81868e5bd57a59966fef218528339766ee2587726c',
        encodedUnsignedExpected: Buffer.from(
            'f8610184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ecd01853078303030853078303030',
            'hex'
        ),
        encodedSignedExpected: Buffer.from(
            'f8e50184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ecd01853078303030853078303030b882ca99d0a802c1d4bf5841d80d6f22383a7e902916575fc70d360c4adb15937d631d321572ba9b22b3a23a9309db4fa1eeaf45d36a9defbd2c9e026126c865fd2c0021191568ba85aeb3aa1f02e07686a4c51af7b4bde4496ca8d2f9af3a28e43e20644d496751f6cfb953c5b5cb435d2b02e7b5efdab892ef4d0c8651797ce3401501',
            'hex'
        ),
        signedTransactionIdExpected:
            '0xd244b56d0ac6d05e6bb3c48867d3093e86414392d46e20f04ecaf026b6f8d20d'
    }
};

/**
 * Test Transaction class.
 * @group unit/transaction
 */
describe('Transaction class tests', () => {
    describe('Construction tests', () => {
        describe('of unsigned transactions', () => {
            test('of undelegated transactions', () => {
                const actual = Transaction.of(
                    TransactionFixture.undelegated.body
                );
                expect(actual).toBeInstanceOf(Transaction);
                expect(actual.signature).toBeUndefined();
                expect(actual.isSigned).toBe(false);
                expect(actual.isDelegated).toBe(false);
                expect(actual.getSignatureHash()).toEqual(
                    TransactionFixture.undelegated.signatureHashExpected
                );
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
                    TransactionFixture.undelegated.encodedUnsigned
                );
                expect(
                    actual.intrinsicGas.isEqual(
                        TransactionFixture.undelegated.intrinsicGas
                    )
                ).toBe(true);
            });

            test('of delegated transactions', () => {});

            test('of delegated transactions with unused fields', () => {});
        });

        describe('of signed transactions', () => {
            test('of undelegated transactions', () => {});

            test('of delegated transactions', () => {});

            test('of delegated transactions with unused fields', () => {});
        });
    });
});
