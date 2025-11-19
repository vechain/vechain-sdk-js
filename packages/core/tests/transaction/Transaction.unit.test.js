"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionFixture = void 0;
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../src");
const GasPayerPrivateKeyFix = src_1.HexUInt.of('40de805e918403683fb9a6081c3fba072cdc5c88232c62a9509165122488dab7').bytes;
const GasPayerFix = {
    privateKey: GasPayerPrivateKeyFix,
    address: src_1.Address.ofPrivateKey(GasPayerPrivateKeyFix)
};
const SignerPrivateKeyFix = src_1.HexUInt.of('7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a').bytes;
const SignerFix = {
    privateKey: SignerPrivateKeyFix,
    address: src_1.Address.ofPrivateKey(SignerPrivateKeyFix)
};
const IntrinsicGasFix = src_1.VTHO.of(37432n, src_1.Units.wei);
// Legacy transaction body
const TxLegacyBodyFix = {
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
const TxEIP1559BodyFix = {
    ...TxLegacyBodyFix,
    gasPriceCoef: undefined,
    maxFeePerGas: 10000000000000,
    maxPriorityFeePerGas: 1000000
};
const LegacyTransactionFixture = {
    invalidReservedFieldNotTrimmed: {
        encodedUnsigned: src_1.HexUInt.of('f8560184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ec28080').bytes
    },
    undelegated: {
        body: TxLegacyBodyFix,
        transactionHash: src_1.HexUInt.of('0x2a1c25ce0d66f45276a5f308b99bf410e2fc7d5b6ea37a49f2ab9f1da9446478'),
        signedTransactionId: src_1.HexUInt.of('0xda90eaea52980bc4bb8d40cb2ff84d78433b3b4a6e7d50b75736c5e3e77b71ec'),
        encodedUnsigned: src_1.HexUInt.of('f8540184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ec0').bytes,
        encodedSigned: src_1.HexUInt.of('f8970184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ec0b841f76f3c91a834165872aa9464fc55b03a13f46ea8d3b858e528fcceaf371ad6884193c3f313ff8effbb57fe4d1adc13dceb933bedbf9dbb528d2936203d5511df00').bytes,
        intrinsicGas: IntrinsicGasFix
    },
    delegated: {
        body: {
            ...TxLegacyBodyFix,
            reserved: {
                features: 1
            }
        },
        transactionHash: src_1.HexUInt.of('0x005fb0b47dfd16b7f2f61bb17df791242bc37ed1fffe9b05fa55fb0fe069f9a3'),
        encodedUnsigned: src_1.HexUInt.of('f8550184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ec101').bytes,
        encodedSigned: src_1.HexUInt.of('f8d90184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ec101b8822cec617320e27c7ddd4058c048328ca7288914a4b9c9a663a0f7673b774b1f2c3e4366ddc5a03724ad9aad72c8805cb7972a927638eee40718e2eb4e580d322d0124a1817609f0971ff356b0252958f6c1d8a23b872a14ac1ccaad88c2ce8d3aa535cdfb1d538e557e63735ab86051ecc2f8c5d2aa1cddd4129a23cbced6ab294b00').bytes,
        signedTransactionId: src_1.HexUInt.of('0xd4d1ae152119bd7c9410844e70b82d6d42c15494f1d59b99f5808a90da403a98'),
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
        transactionHash: src_1.HexUInt.of('0xd6e8f162e3e08585ee8fcf81868e5bd57a59966fef218528339766ee2587726c'),
        encodedUnsigned: src_1.HexUInt.of('f8610184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ecd01853078303030853078303030').bytes,
        encodedSigned: src_1.HexUInt.of('f8e50184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ecd01853078303030853078303030b882ca99d0a802c1d4bf5841d80d6f22383a7e902916575fc70d360c4adb15937d631d321572ba9b22b3a23a9309db4fa1eeaf45d36a9defbd2c9e026126c865fd2c0021191568ba85aeb3aa1f02e07686a4c51af7b4bde4496ca8d2f9af3a28e43e20644d496751f6cfb953c5b5cb435d2b02e7b5efdab892ef4d0c8651797ce3401501').bytes,
        signedTransactionId: src_1.HexUInt.of('0xd244b56d0ac6d05e6bb3c48867d3093e86414392d46e20f04ecaf026b6f8d20d'),
        intrinsicGas: IntrinsicGasFix
    }
};
exports.TransactionFixture = LegacyTransactionFixture;
/**
 * Test Transaction class.
 * @group unit/transaction
 */
(0, globals_1.describe)('Transaction class Legacy tests', () => {
    (0, globals_1.describe)('Construction tests', () => {
        (0, globals_1.describe)('of unsigned transactions', () => {
            test('Transaction <- of undelegated transactions', () => {
                const expected = LegacyTransactionFixture.undelegated;
                const actual = src_1.Transaction.of(expected.body);
                (0, globals_1.expect)(actual).toBeInstanceOf(src_1.Transaction);
                (0, globals_1.expect)(actual.signature).toBeUndefined();
                (0, globals_1.expect)(actual.isSigned).toBe(false);
                (0, globals_1.expect)(actual.isDelegated).toBe(false);
                (0, globals_1.expect)(actual
                    .getTransactionHash()
                    .isEqual(LegacyTransactionFixture.undelegated.transactionHash)).toBe(true);
                (0, globals_1.expect)(() => actual.id).toThrowError(sdk_errors_1.UnavailableTransactionField);
                (0, globals_1.expect)(() => actual.origin).toThrowError(sdk_errors_1.UnavailableTransactionField);
                (0, globals_1.expect)(() => actual.gasPayer).toThrowError(sdk_errors_1.NotDelegatedTransaction);
                (0, globals_1.expect)(actual.encoded).toEqual(expected.encodedUnsigned);
                (0, globals_1.expect)(actual.intrinsicGas.isEqual(expected.intrinsicGas)).toBe(true);
            });
            test('Transaction <- of delegated transactions', () => {
                const expected = LegacyTransactionFixture.delegated;
                const actual = src_1.Transaction.of(expected.body);
                (0, globals_1.expect)(actual).toBeInstanceOf(src_1.Transaction);
                (0, globals_1.expect)(actual.isSigned).toBe(false);
                (0, globals_1.expect)(actual.isDelegated).toEqual(true);
                (0, globals_1.expect)(actual
                    .getTransactionHash()
                    .isEqual(expected.transactionHash)).toBe(true);
                (0, globals_1.expect)(() => actual.id).toThrowError(sdk_errors_1.UnavailableTransactionField);
                (0, globals_1.expect)(() => actual.origin).toThrowError(sdk_errors_1.UnavailableTransactionField);
                (0, globals_1.expect)(() => actual.gasPayer).toThrowError(sdk_errors_1.UnavailableTransactionField);
                (0, globals_1.expect)(actual.encoded).toEqual(expected.encodedUnsigned);
                (0, globals_1.expect)(actual.intrinsicGas.isEqual(expected.intrinsicGas)).toBe(true);
            });
            test('Transaction <- of delegated transactions with unused fields', () => {
                const expected = LegacyTransactionFixture.delegatedWithUnusedFields;
                const actual = src_1.Transaction.of(expected.body);
                (0, globals_1.expect)(actual).toBeInstanceOf(src_1.Transaction);
                (0, globals_1.expect)(actual.isSigned).toBe(false);
                (0, globals_1.expect)(actual.isDelegated).toEqual(true);
                (0, globals_1.expect)(actual
                    .getTransactionHash()
                    .isEqual(expected.transactionHash)).toBe(true);
                (0, globals_1.expect)(() => actual.id).toThrowError(sdk_errors_1.UnavailableTransactionField);
                (0, globals_1.expect)(() => actual.origin).toThrowError(sdk_errors_1.UnavailableTransactionField);
                (0, globals_1.expect)(() => actual.gasPayer).toThrowError(sdk_errors_1.UnavailableTransactionField);
                (0, globals_1.expect)(actual.encoded).toEqual(expected.encodedUnsigned);
                (0, globals_1.expect)(actual.intrinsicGas.isEqual(expected.intrinsicGas)).toBe(true);
            });
            test('Transaction <- of delegated transactions simulating partial signed transmission between two different JS runtimes.', () => {
                const signed = src_1.Transaction.of(LegacyTransactionFixture.delegated.body).signAsSender(SignerFix.privateKey);
                const reconstructed = src_1.Transaction.of(signed.body, signed.signature);
                (0, globals_1.expect)(reconstructed.signature).toBeDefined();
                (0, globals_1.expect)(reconstructed.isDelegated).toBe(true);
                (0, globals_1.expect)(reconstructed.isSigned).toBe(false);
                const signer = src_1.Address.ofPrivateKey(SignerFix.privateKey);
                const actual = signed.signAsGasPayer(signer, GasPayerFix.privateKey);
                (0, globals_1.expect)(actual.isDelegated).toBe(true);
                (0, globals_1.expect)(actual.isSigned).toBe(true);
                const expected = LegacyTransactionFixture.delegated.encodedSigned;
                (0, globals_1.expect)(actual.encoded).toEqual(expected);
            });
        });
        (0, globals_1.describe)('of signed transactions', () => {
            test('Transaction <- of undelegated transactions', () => {
                const expected = LegacyTransactionFixture.undelegated;
                const actual = src_1.Transaction.of(expected.body).sign(SignerFix.privateKey);
                (0, globals_1.expect)(actual).toBeInstanceOf(src_1.Transaction);
                (0, globals_1.expect)(actual.signature).toBeDefined();
                (0, globals_1.expect)(actual.signature?.length).toBe(src_1.Secp256k1.SIGNATURE_LENGTH);
                (0, globals_1.expect)(actual.isSigned).toEqual(true);
                (0, globals_1.expect)(actual.isDelegated).toEqual(false);
                (0, globals_1.expect)(actual
                    .getTransactionHash()
                    .isEqual(expected.transactionHash)).toBe(true);
                (0, globals_1.expect)(actual.origin.isEqual(SignerFix.address)).toBe(true);
                (0, globals_1.expect)(() => actual.gasPayer).toThrowError(sdk_errors_1.NotDelegatedTransaction);
                (0, globals_1.expect)(actual.id.isEqual(expected.signedTransactionId)).toBe(true);
                (0, globals_1.expect)(actual.encoded).toEqual(expected.encodedSigned);
            });
            test('Transaction <- of delegated transactions', () => {
                const expected = LegacyTransactionFixture.delegated;
                const actual = src_1.Transaction.of(expected.body).signAsSenderAndGasPayer(SignerFix.privateKey, GasPayerFix.privateKey);
                (0, globals_1.expect)(actual).toBeInstanceOf(src_1.Transaction);
                (0, globals_1.expect)(actual.signature).toBeDefined();
                (0, globals_1.expect)(actual.signature?.length).toBe(src_1.Secp256k1.SIGNATURE_LENGTH * 2);
                (0, globals_1.expect)(actual.isSigned).toEqual(true);
                (0, globals_1.expect)(actual.isDelegated).toEqual(true);
                (0, globals_1.expect)(actual
                    .getTransactionHash()
                    .isEqual(expected.transactionHash)).toBe(true);
                (0, globals_1.expect)(actual.origin.isEqual(SignerFix.address)).toBe(true);
                (0, globals_1.expect)(actual.gasPayer.isEqual(GasPayerFix.address)).toBe(true);
                (0, globals_1.expect)(actual.id.isEqual(expected.signedTransactionId)).toBe(true);
                (0, globals_1.expect)(actual.encoded).toEqual(expected.encodedSigned);
            });
            test('Transaction <- of delegated transactions with unused fields', () => {
                const expected = LegacyTransactionFixture.delegatedWithUnusedFields;
                const actual = src_1.Transaction.of(expected.body).signAsSenderAndGasPayer(SignerFix.privateKey, GasPayerFix.privateKey);
                (0, globals_1.expect)(actual).toBeInstanceOf(src_1.Transaction);
                (0, globals_1.expect)(actual.signature).toBeDefined();
                (0, globals_1.expect)(actual.signature?.length).toBe(src_1.Secp256k1.SIGNATURE_LENGTH * 2);
                (0, globals_1.expect)(actual.isSigned).toEqual(true);
                (0, globals_1.expect)(actual.isDelegated).toEqual(true);
                (0, globals_1.expect)(actual
                    .getTransactionHash()
                    .isEqual(expected.transactionHash)).toBe(true);
                (0, globals_1.expect)(actual.origin.isEqual(SignerFix.address)).toBe(true);
                (0, globals_1.expect)(actual.gasPayer.isEqual(GasPayerFix.address)).toBe(true);
                (0, globals_1.expect)(actual.id.isEqual(expected.signedTransactionId)).toBe(true);
                (0, globals_1.expect)(actual.encoded).toEqual(expected.encodedSigned);
            });
        });
        (0, globals_1.describe)('Exceptions', () => {
            test('Throw <- of invalid body', () => {
                (0, globals_1.expect)(() => src_1.Transaction.of({
                    ...LegacyTransactionFixture.delegated.body,
                    blockRef: '0xFEE1DEAD'
                })).toThrowError(sdk_errors_1.InvalidTransactionField);
            });
        });
    });
    (0, globals_1.describe)('decode method tests', () => {
        (0, globals_1.describe)('decode undelegated', () => {
            test('Transaction <- decode undelegated unsigned', () => {
                const expected = LegacyTransactionFixture.undelegated;
                const actual = src_1.Transaction.decode(expected.encodedUnsigned, false);
                (0, globals_1.expect)(actual).toBeInstanceOf(src_1.Transaction);
                (0, globals_1.expect)(actual.body).toEqual(expected.body);
                (0, globals_1.expect)(actual.signature).toBeUndefined();
                (0, globals_1.expect)(() => actual.origin).toThrowError(sdk_errors_1.UnavailableTransactionField);
                (0, globals_1.expect)(() => actual.gasPayer).toThrowError(sdk_errors_1.NotDelegatedTransaction);
                (0, globals_1.expect)(actual.isDelegated).toBe(false);
                (0, globals_1.expect)(() => actual.id).toThrowError(sdk_errors_1.UnavailableTransactionField);
                (0, globals_1.expect)(actual.isSigned).toBe(false);
                (0, globals_1.expect)(actual.getTransactionHash()).toBeDefined();
                (0, globals_1.expect)(actual.encoded).toBeDefined();
                (0, globals_1.expect)(actual.encoded).toEqual(expected.encodedUnsigned);
            });
            test('Transaction <- decode undelegated signed', () => {
                const expected = LegacyTransactionFixture.undelegated;
                const actual = src_1.Transaction.decode(expected.encodedSigned, true);
                (0, globals_1.expect)(actual).toBeInstanceOf(src_1.Transaction);
                (0, globals_1.expect)(actual.body).toEqual(expected.body);
                (0, globals_1.expect)(() => actual.signature).toBeDefined();
                (0, globals_1.expect)(actual.origin).toBeDefined();
                (0, globals_1.expect)(() => actual.gasPayer).toThrowError(sdk_errors_1.NotDelegatedTransaction);
                (0, globals_1.expect)(actual.isDelegated).toBe(false);
                (0, globals_1.expect)(actual.id).toBeDefined();
                (0, globals_1.expect)(actual.isSigned).toBe(true);
                (0, globals_1.expect)(actual.getTransactionHash()).toBeDefined();
                (0, globals_1.expect)(actual.encoded).toBeDefined();
                (0, globals_1.expect)(actual.encoded).toEqual(expected.encodedSigned);
            });
        });
        (0, globals_1.describe)('decode delegated', () => {
            test('Transaction <- decode delegated unsigned', () => {
                const expected = LegacyTransactionFixture.delegated;
                const actual = src_1.Transaction.decode(expected.encodedUnsigned, false);
                (0, globals_1.expect)(actual).toBeInstanceOf(src_1.Transaction);
                (0, globals_1.expect)(actual.body).toEqual(expected.body);
                (0, globals_1.expect)(actual.signature).toBeUndefined();
                (0, globals_1.expect)(() => actual.origin).toThrowError(sdk_errors_1.UnavailableTransactionField);
                (0, globals_1.expect)(() => actual.gasPayer).toThrowError(sdk_errors_1.UnavailableTransactionField);
                (0, globals_1.expect)(actual.isDelegated).toBe(true);
                (0, globals_1.expect)(() => actual.id).toThrowError(sdk_errors_1.UnavailableTransactionField);
                (0, globals_1.expect)(actual.isSigned).toBe(false);
                (0, globals_1.expect)(actual.getTransactionHash()).toBeDefined();
                (0, globals_1.expect)(actual.getTransactionHash().bytes.length).toBe(32);
                (0, globals_1.expect)(actual.encoded).toBeDefined();
                (0, globals_1.expect)(actual.encoded).toEqual(expected.encodedUnsigned);
            });
            test('Transaction <- decode delegated signed', () => {
                const expected = LegacyTransactionFixture.delegated;
                const actual = src_1.Transaction.decode(expected.encodedSigned, true);
                (0, globals_1.expect)(actual).toBeInstanceOf(src_1.Transaction);
                (0, globals_1.expect)(actual.body).toEqual(expected.body);
                (0, globals_1.expect)(actual.signature).toBeDefined();
                (0, globals_1.expect)(actual.origin).toBeDefined();
                (0, globals_1.expect)(actual.origin.isEqual(SignerFix.address)).toBe(true);
                (0, globals_1.expect)(actual.gasPayer).toBeDefined();
                (0, globals_1.expect)(actual.gasPayer.isEqual(GasPayerFix.address)).toBe(true);
                (0, globals_1.expect)(actual.isDelegated).toBe(true);
                (0, globals_1.expect)(actual.id).toBeDefined();
                (0, globals_1.expect)(actual.isSigned).toBe(true);
                (0, globals_1.expect)(actual.getTransactionHash()).toBeDefined();
                (0, globals_1.expect)(actual.encoded).toBeDefined();
                (0, globals_1.expect)(actual.encoded).toEqual(expected.encodedSigned);
                (0, globals_1.expect)(actual.signature).toBeDefined();
                (0, globals_1.expect)(actual.signature?.length).toBe(src_1.Secp256k1.SIGNATURE_LENGTH * 2);
            });
        });
        (0, globals_1.describe)('decode delegated with unused fields', () => {
            test('Transaction <- decode delegates with unused fields unsigned', () => {
                const expected = LegacyTransactionFixture.delegatedWithUnusedFields;
                const actual = src_1.Transaction.decode(expected.encodedUnsigned, false);
                (0, globals_1.expect)(actual).toBeInstanceOf(src_1.Transaction);
                (0, globals_1.expect)(actual.body).toEqual(expected.body);
                (0, globals_1.expect)(actual.signature).toBeUndefined();
                (0, globals_1.expect)(() => actual.origin).toThrowError(sdk_errors_1.UnavailableTransactionField);
                (0, globals_1.expect)(() => actual.gasPayer).toThrowError(sdk_errors_1.UnavailableTransactionField);
                (0, globals_1.expect)(actual.isDelegated).toBe(true);
                (0, globals_1.expect)(() => actual.id).toThrowError(sdk_errors_1.UnavailableTransactionField);
                (0, globals_1.expect)(actual.isSigned).toBe(false);
                (0, globals_1.expect)(actual.getTransactionHash()).toBeDefined();
                (0, globals_1.expect)(actual.getTransactionHash().bytes.length).toBe(32);
                (0, globals_1.expect)(actual.encoded).toBeDefined();
                (0, globals_1.expect)(actual.encoded).toEqual(expected.encodedUnsigned);
            });
            test('Transaction <- decode delegates with unused fields signed', () => {
                const expected = LegacyTransactionFixture.delegatedWithUnusedFields;
                const actual = src_1.Transaction.decode(expected.encodedSigned, true);
                (0, globals_1.expect)(actual).toBeInstanceOf(src_1.Transaction);
                (0, globals_1.expect)(actual.body).toEqual(expected.body);
                (0, globals_1.expect)(actual.signature).toBeDefined();
                (0, globals_1.expect)(actual.origin).toBeDefined();
                (0, globals_1.expect)(actual.origin.isEqual(SignerFix.address)).toBe(true);
                (0, globals_1.expect)(actual.gasPayer).toBeDefined();
                (0, globals_1.expect)(actual.gasPayer.isEqual(GasPayerFix.address)).toBe(true);
                (0, globals_1.expect)(actual.isDelegated).toBe(true);
                (0, globals_1.expect)(actual.id).toBeDefined();
                (0, globals_1.expect)(actual.isSigned).toBe(true);
                (0, globals_1.expect)(actual.getTransactionHash()).toBeDefined();
                (0, globals_1.expect)(actual.encoded).toBeDefined();
                (0, globals_1.expect)(actual.encoded).toEqual(expected.encodedSigned);
                (0, globals_1.expect)(actual.signature).toBeDefined();
                (0, globals_1.expect)(actual.signature?.length).toBe(src_1.Secp256k1.SIGNATURE_LENGTH * 2);
            });
        });
        (0, globals_1.describe)('Exceptions', () => {
            test('Throw <- decode invalid data', () => {
                // Not trimmed reserved field error
                (0, globals_1.expect)(() => src_1.Transaction.decode(LegacyTransactionFixture.invalidReservedFieldNotTrimmed
                    .encodedUnsigned, false)).toThrowError(sdk_errors_1.InvalidTransactionField);
            });
        });
    });
    (0, globals_1.describe)('intrinsicGas method tests', () => {
        (0, globals_1.describe)('intrinsicGas for clauses with smart-contract', () => {
            test('VTHO <- intrinsicGas with no data', () => {
                const clauses = [
                    {
                        to: null,
                        value: 0,
                        data: ''
                    }
                ];
                const actual = src_1.Transaction.intrinsicGas(clauses);
                (0, globals_1.expect)(actual.wei).toBe(BigInt(src_1.Transaction.GAS_CONSTANTS.CLAUSE_GAS_CONTRACT_CREATION +
                    src_1.Transaction.GAS_CONSTANTS.TX_GAS));
            });
            test('VTHO <- intrinsicGas with zeros data', () => {
                const times = 100;
                const clauses = [
                    {
                        to: null,
                        value: 0,
                        data: '0x' + '00'.repeat(times)
                    }
                ];
                const actual = src_1.Transaction.intrinsicGas(clauses);
                (0, globals_1.expect)(actual.wei).toBe(src_1.Transaction.GAS_CONSTANTS.CLAUSE_GAS_CONTRACT_CREATION +
                    src_1.Transaction.GAS_CONSTANTS.TX_GAS +
                    src_1.Transaction.GAS_CONSTANTS.ZERO_GAS_DATA * BigInt(times));
            });
            test('VTHO <- intrinsicGas with non-zeros data', () => {
                const times = 100;
                const clauses = [
                    {
                        to: null,
                        value: 0,
                        data: '0x' + '10'.repeat(times)
                    }
                ];
                const actual = src_1.Transaction.intrinsicGas(clauses);
                (0, globals_1.expect)(actual.wei).toBe(src_1.Transaction.GAS_CONSTANTS.CLAUSE_GAS_CONTRACT_CREATION +
                    src_1.Transaction.GAS_CONSTANTS.TX_GAS +
                    src_1.Transaction.GAS_CONSTANTS.NON_ZERO_GAS_DATA *
                        BigInt(times));
            });
            test('VTHO <- intrinsicGas with mixed data', () => {
                const times = 100;
                const clauses = [
                    {
                        to: null,
                        value: 0,
                        data: '0x' + '00'.repeat(times) + '10'.repeat(times)
                    }
                ];
                const actual = src_1.Transaction.intrinsicGas(clauses);
                (0, globals_1.expect)(actual.wei).toBe(src_1.Transaction.GAS_CONSTANTS.CLAUSE_GAS_CONTRACT_CREATION +
                    src_1.Transaction.GAS_CONSTANTS.TX_GAS +
                    src_1.Transaction.GAS_CONSTANTS.ZERO_GAS_DATA *
                        BigInt(times) +
                    src_1.Transaction.GAS_CONSTANTS.NON_ZERO_GAS_DATA *
                        BigInt(times));
            });
        });
        (0, globals_1.describe)('intrinsicGas for clauses without smart-contract', () => {
            test('VTHO <- intrinsicGas with no clauses', () => {
                (0, globals_1.expect)(src_1.Transaction.intrinsicGas([]).wei).toBe(BigInt(src_1.Transaction.GAS_CONSTANTS.TX_GAS +
                    src_1.Transaction.GAS_CONSTANTS.CLAUSE_GAS));
            });
            test('VTHO <- intrinsicGas with single clause', () => {
                const clauses = [
                    {
                        to: '0x0000000000000000000000000000000000000000',
                        value: 0,
                        data: ''
                    }
                ];
                const actual = src_1.Transaction.intrinsicGas(clauses);
                (0, globals_1.expect)(actual.wei).toBe(BigInt(src_1.Transaction.GAS_CONSTANTS.CLAUSE_GAS +
                    src_1.Transaction.GAS_CONSTANTS.TX_GAS));
            });
            test('VTHO <- intrinsicGas with multiple clauses', () => {
                const times = 5;
                const clauses = Array(times).fill({
                    to: '0x0000000000000000000000000000000000000000',
                    value: 0,
                    data: ''
                });
                const actual = src_1.Transaction.intrinsicGas(clauses);
                (0, globals_1.expect)(actual.wei).toBe(src_1.Transaction.GAS_CONSTANTS.CLAUSE_GAS * BigInt(times) +
                    src_1.Transaction.GAS_CONSTANTS.TX_GAS);
            });
        });
        (0, globals_1.describe)('Exceptions', () => {
            test('Throw <- invalid field', () => {
                const clauses = [
                    {
                        to: 'INVALID ADDRESS',
                        value: 0,
                        data: ''
                    }
                ];
                (0, globals_1.expect)(() => src_1.Transaction.intrinsicGas(clauses)).toThrowError(sdk_errors_1.InvalidDataType);
            });
            test('Throw <- invalid data content', () => {
                const clauses = [
                    {
                        to: null,
                        value: 0,
                        data: 'INVALID DATA FORMAT'
                    }
                ];
                (0, globals_1.expect)(() => src_1.Transaction.intrinsicGas(clauses)).toThrowError(sdk_errors_1.InvalidDataType);
            });
        });
    });
    (0, globals_1.describe)('sign method tests', () => {
        test('signature <- undelegated tx', () => {
            const actual = src_1.Transaction.of(LegacyTransactionFixture.undelegated.body).sign(SignerFix.privateKey);
            (0, globals_1.expect)(actual.signature).toBeDefined();
            (0, globals_1.expect)(actual.signature?.length).toBe(src_1.Secp256k1.SIGNATURE_LENGTH);
        });
        test('Throw <- delegated tx', () => {
            (0, globals_1.expect)(() => src_1.Transaction.of(LegacyTransactionFixture.delegated.body).sign(SignerFix.privateKey)).toThrowError(sdk_errors_1.InvalidTransactionField);
        });
        test('Throw <- invalid private keys', () => {
            (0, globals_1.expect)(() => src_1.Transaction.of(LegacyTransactionFixture.undelegated.body).sign(src_1.HexUInt.of('0xF00DBABE').bytes // https://en.wikipedia.org/wiki/Hexspeak
            )).toThrowError(sdk_errors_1.InvalidSecp256k1PrivateKey);
        });
    });
    (0, globals_1.describe)('signAsGasPayer method tests', () => {
        test('signature (complete) <- delegated tx', () => {
            const expected = src_1.Transaction.of(LegacyTransactionFixture.delegated.body).signAsSenderAndGasPayer(SignerFix.privateKey, GasPayerFix.privateKey);
            const signed = src_1.Transaction.of(LegacyTransactionFixture.delegated.body).signAsSender(SignerFix.privateKey);
            const signer = src_1.Address.ofPrivateKey(SignerFix.privateKey);
            const actual = signed.signAsGasPayer(signer, GasPayerFix.privateKey);
            (0, globals_1.expect)(actual.signature).toEqual(expected.signature);
        });
        test('Throw <- undelegated tx', () => {
            (0, globals_1.expect)(() => {
                src_1.Transaction.of(LegacyTransactionFixture.undelegated.body)
                    .sign(SignerFix.privateKey)
                    .signAsGasPayer(src_1.Address.ofPrivateKey(SignerFix.privateKey), SignerFix.privateKey);
            }).toThrowError(sdk_errors_1.NotDelegatedTransaction);
        });
        test('signature (only of the gasPayer) <- unsigned tx', () => {
            (0, globals_1.expect)(src_1.Transaction.of(LegacyTransactionFixture.delegated.body).signAsGasPayer(src_1.Address.ofPrivateKey(SignerFix.privateKey), SignerFix.privateKey).signature.length).toBe(65);
        });
        test('Throw <- invalid private keys - delegated tx', () => {
            (0, globals_1.expect)(() => src_1.Transaction.of(LegacyTransactionFixture.undelegated.body).signAsSender(src_1.HexUInt.of('0xF00DBABE').bytes // https://en.wikipedia.org/wiki/Hexspeak
            )).toThrowError(sdk_errors_1.InvalidSecp256k1PrivateKey);
        });
    });
    (0, globals_1.describe)('signAsSender method tests', () => {
        test('signature (incomplete) <- signed', () => {
            const expected = src_1.Transaction.of(LegacyTransactionFixture.delegated.body).signAsSenderAndGasPayer(SignerFix.privateKey, GasPayerFix.privateKey);
            const actual = src_1.Transaction.of(LegacyTransactionFixture.delegated.body).signAsSender(SignerFix.privateKey);
            (0, globals_1.expect)(actual.signature).toBeDefined(); // The signer's signature exists, but...
            // ... the gasPayer signature is missing, hence...
            (0, globals_1.expect)(actual.isSigned).toBe(false); // ... the signature is incomplete.
            (0, globals_1.expect)(actual.signature).toEqual(expected.signature?.slice(0, actual.signature?.length));
        });
        test('Throw <- undelegated tx', () => {
            (0, globals_1.expect)(() => src_1.Transaction.of(LegacyTransactionFixture.undelegated.body).signAsSender(SignerFix.privateKey)).toThrowError(sdk_errors_1.NotDelegatedTransaction);
        });
        test('Throw <- invalid private keys - signer', () => {
            (0, globals_1.expect)(() => src_1.Transaction.of(LegacyTransactionFixture.undelegated.body).signAsSender(src_1.HexUInt.of('0xF00DBABE').bytes // https://en.wikipedia.org/wiki/Hexspeak
            )).toThrowError(sdk_errors_1.InvalidSecp256k1PrivateKey);
        });
    });
    (0, globals_1.describe)('signAsSenderAndGasPayer method tests', () => {
        test('signature <- delegated tx', () => {
            const actual = src_1.Transaction.of(LegacyTransactionFixture.delegated.body).signAsSenderAndGasPayer(SignerFix.privateKey, GasPayerFix.privateKey);
            (0, globals_1.expect)(actual.isDelegated).toBe(true);
            (0, globals_1.expect)(actual.id).toBeDefined();
            (0, globals_1.expect)(actual.signature).toBeDefined();
            (0, globals_1.expect)(actual.signature?.length).toBe(src_1.Secp256k1.SIGNATURE_LENGTH * 2);
            (0, globals_1.expect)(actual.origin.isEqual(SignerFix.address)).toBe(true);
            (0, globals_1.expect)(actual.gasPayer.isEqual(GasPayerFix.address)).toBe(true);
        });
        test('Throw <- undelegated tx', () => {
            (0, globals_1.expect)(() => src_1.Transaction.of(LegacyTransactionFixture.undelegated.body).signAsSenderAndGasPayer(SignerFix.privateKey, GasPayerFix.privateKey)).toThrowError(sdk_errors_1.NotDelegatedTransaction);
        });
        test('Throw <- invalid private keys - signer', () => {
            (0, globals_1.expect)(() => src_1.Transaction.of(LegacyTransactionFixture.undelegated.body).signAsSenderAndGasPayer(src_1.HexUInt.of('0xF00DBABE').bytes, // https://en.wikipedia.org/wiki/Hexspeak
            GasPayerFix.privateKey)).toThrowError(sdk_errors_1.InvalidSecp256k1PrivateKey);
        });
        test('Throw <- invalid private keys - delegated tx', () => {
            (0, globals_1.expect)(() => {
                src_1.Transaction.of(LegacyTransactionFixture.undelegated.body).signAsSenderAndGasPayer(SignerFix.privateKey, src_1.HexUInt.of('0xF00DBABE').bytes // https://en.wikipedia.org/wiki/Hexspeak
                );
            }).toThrowError(sdk_errors_1.InvalidSecp256k1PrivateKey);
        });
    });
});
(0, globals_1.describe)('Transaction class EIP-1559 tests', () => {
    test('encode/decode <- unsigned EIP-1559 tx', () => {
        const tx = src_1.Transaction.of(TxEIP1559BodyFix);
        const encoded = tx.encoded;
        const decoded = src_1.Transaction.decode(encoded, false);
        (0, globals_1.expect)(decoded).toEqual(tx);
    });
    test('encode/decode <- signed EIP-1559 tx', () => {
        const tx = src_1.Transaction.of(TxEIP1559BodyFix).sign(SignerFix.privateKey);
        const encoded = tx.encoded;
        const decoded = src_1.Transaction.decode(encoded, true);
        (0, globals_1.expect)(decoded).toEqual(tx);
        (0, globals_1.expect)(decoded.isSigned).toBe(true);
    });
    test('exception <- maxPriorityFeePerGas field not specified', () => {
        const clauses = [
            {
                to: src_1.ZERO_ADDRESS,
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
        (0, globals_1.expect)(() => src_1.Transaction.of(transactionBodyWithoutMaxPriorityFeePerGas)).toThrowError(sdk_errors_1.InvalidTransactionField);
    });
    test('exception <- maxFeePerGas field not specified', () => {
        const clauses = [
            {
                to: src_1.ZERO_ADDRESS,
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
        (0, globals_1.expect)(() => src_1.Transaction.of(transactionBodyWithoutMaxPriorityFeePerGas)).toThrowError(sdk_errors_1.InvalidTransactionField);
    });
});
(0, globals_1.describe)('Transaction validation', () => {
    test('Should reject transactions with both legacy and EIP-1559 parameters', () => {
        // Create a transaction body with both parameter types
        const mixedBody = {
            ...TxLegacyBodyFix,
            maxFeePerGas: 10000000000000
            // maxPriorityFeePerGas: 1000000
        };
        // Should throw InvalidTransactionField when using Transaction.of
        (0, globals_1.expect)(() => src_1.Transaction.of(mixedBody)).toThrow(sdk_errors_1.InvalidTransactionField);
    });
});
(0, globals_1.describe)('Transaction parameter validation', () => {
    test('Should accept valid legacy transactions', () => {
        // Only legacy params
        const legacyBody = {
            ...TxLegacyBodyFix
        };
        // Should not throw error
        (0, globals_1.expect)(() => src_1.Transaction.of(legacyBody)).not.toThrow();
    });
    test('Should accept valid EIP-1559 transactions', () => {
        // Only EIP-1559 params
        const eip1559Body = {
            ...TxEIP1559BodyFix
        };
        // Should not throw error
        (0, globals_1.expect)(() => src_1.Transaction.of(eip1559Body)).not.toThrow();
    });
    test('Should reject legacy transactions with maxFeePerGas', () => {
        // Legacy with one EIP-1559 param
        const mixedBody = {
            ...TxLegacyBodyFix,
            maxFeePerGas: 10000000000000
        };
        // Should throw error
        (0, globals_1.expect)(() => src_1.Transaction.of(mixedBody)).toThrow(sdk_errors_1.InvalidTransactionField);
    });
    test('Should reject legacy transactions with maxPriorityFeePerGas', () => {
        // Legacy with the other EIP-1559 param
        const mixedBody = {
            ...TxLegacyBodyFix,
            maxPriorityFeePerGas: 1000000
        };
        // Should throw error
        (0, globals_1.expect)(() => src_1.Transaction.of(mixedBody)).toThrow(sdk_errors_1.InvalidTransactionField);
    });
    test('Should reject EIP-1559 transactions with gasPriceCoef', () => {
        // EIP-1559 with legacy param
        const mixedBody = {
            ...TxEIP1559BodyFix,
            gasPriceCoef: 128
        };
        // Should throw error
        (0, globals_1.expect)(() => src_1.Transaction.of(mixedBody)).toThrow(sdk_errors_1.InvalidTransactionField);
    });
});
