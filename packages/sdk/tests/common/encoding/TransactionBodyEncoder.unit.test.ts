import { RLPEncodingError } from '@common/errors';
import { Address, Hex } from '@common/vcdm';
import { TransactionBodyEncoder } from '@common/encoding/rlp/TransactionBodyEncoder';
import { describe, expect, test } from '@jest/globals';
import {
    Clause,
    TransactionRequest
} from '@thor/thor-client/model/transactions';
import { TransactionBody } from '@thor/thor-client/model/transactions/TransactionBody';

/**
 * @group unit
 */
describe('TransactionRequestEncoder', () => {
    describe('encodeTransactionRequest', () => {
        describe('Legacy Transaction', () => {
            test('ok <- should encode a not signed, not delegated, no depends on tx', () => {
                const txBody: TransactionBody = {
                    chainTag: 1,
                    blockRef: Hex.of('0x1234567890abcdef'),
                    expiration: 100,
                    clauses: [
                        new Clause(
                            Address.of(
                                '0x18596ed436016b30ec444Fc983DEDF16CF64057e'
                            ),
                            100n,
                            Hex.of('0x')
                        ),
                        new Clause(
                            Address.of(
                                '0x0000000000000000000000000000000000000000'
                            ),
                            50n
                        )
                    ],
                    gas: 100000n,
                    gasPriceCoef: 128n,
                    dependsOn: null,
                    nonce: 9n,
                    reserved: {
                        features: 0,
                        unused: []
                    }
                };
                const encoded =
                    TransactionBodyEncoder.encodeTransactionBody(txBody);
                expect(Hex.of(encoded).toString().toLowerCase()).toBe(
                    '0xf84501881234567890abcdef64f0d79418596ed436016b30ec444fc983dedf16cf64057e6480d794000000000000000000000000000000000000000032808180830186a08009c0'.toLowerCase()
                );
            });
            test('ok <- should encode a not signed, fee delegated, no depends on tx', () => {
                const txBody: TransactionBody = {
                    chainTag: 1,
                    blockRef: Hex.of('0x1234567890abcdef'),
                    expiration: 100,
                    clauses: [
                        new Clause(
                            Address.of(
                                '0x18596ed436016b30ec444Fc983DEDF16CF64057e'
                            ),
                            100n,
                            Hex.of('0x')
                        ),
                        new Clause(
                            Address.of(
                                '0x0000000000000000000000000000000000000000'
                            ),
                            50n
                        )
                    ],
                    gas: 100000n,
                    gasPriceCoef: 128n,
                    dependsOn: null,
                    nonce: 9n,
                    reserved: {
                        features: 1,
                        unused: []
                    }
                };
                const encoded =
                    TransactionBodyEncoder.encodeTransactionBody(txBody);
                expect(Hex.of(encoded).toString().toLowerCase()).toBe(
                    '0xf84601881234567890abcdef64f0d79418596ed436016b30ec444fc983dedf16cf64057e6480d794000000000000000000000000000000000000000032808180830186a08009c101'.toLowerCase()
                );
            });
            test('ok <- should encode a not signed, fee delegated, depends on tx', () => {
                const txBody: TransactionBody = {
                    chainTag: 1,
                    blockRef: Hex.of('0x1234567890abcdef'),
                    expiration: 100,
                    clauses: [
                        new Clause(
                            Address.of(
                                '0x18596ed436016b30ec444Fc983DEDF16CF64057e'
                            ),
                            100n,
                            Hex.of('0x')
                        ),
                        new Clause(
                            Address.of(
                                '0x0000000000000000000000000000000000000000'
                            ),
                            50n
                        )
                    ],
                    gas: 100000n,
                    gasPriceCoef: 128n,
                    dependsOn: Hex.of(
                        '0x6a8ffffede10451e6038ec8f8c4ceb99fe6c0007e996dcb095d5ff7abe022b6f'
                    ),
                    nonce: 9n,
                    reserved: {
                        features: 1,
                        unused: []
                    }
                };
                const encoded =
                    TransactionBodyEncoder.encodeTransactionBody(txBody);
                expect(Hex.of(encoded).toString().toLowerCase()).toBe(
                    '0xf86601881234567890abcdef64f0d79418596ed436016b30ec444fc983dedf16cf64057e6480d794000000000000000000000000000000000000000032808180830186a0a06a8ffffede10451e6038ec8f8c4ceb99fe6c0007e996dcb095d5ff7abe022b6f09c101'.toLowerCase()
                );
            });
            test('error <- should throw an error if a field is too large', () => {
                const txBody: TransactionBody = {
                    chainTag: 1,
                    blockRef: Hex.of(
                        '0x1234567890abcdef1234567890abcdef1234567890' // too large
                    ),
                    expiration: 100,
                    clauses: [
                        new Clause(
                            Address.of(
                                '0x18596ed436016b30ec444Fc983DEDF16CF64057e'
                            ),
                            100n,
                            Hex.of('0x')
                        ),
                        new Clause(
                            Address.of(
                                '0x0000000000000000000000000000000000000000'
                            ),
                            50n
                        )
                    ],
                    gas: 100000n,
                    gasPriceCoef: 128n,
                    dependsOn: null,
                    nonce: 9n,
                    reserved: {
                        features: 0,
                        unused: []
                    }
                };
                expect(() =>
                    TransactionBodyEncoder.encodeTransactionBody(txBody)
                ).toThrow(RLPEncodingError);
            });
            test('ok <- should encode a not signed, not delegated, no depends on tx, no clauses', () => {
                const txBody: TransactionBody = {
                    chainTag: 1,
                    blockRef: Hex.of('0x1234567890abcdef'),
                    expiration: 100,
                    clauses: [],
                    gas: 100000n,
                    gasPriceCoef: 128n,
                    dependsOn: null,
                    nonce: 9n,
                    reserved: {
                        features: 0,
                        unused: []
                    }
                };
                const encoded =
                    TransactionBodyEncoder.encodeTransactionBody(txBody);
                expect(Hex.of(encoded).toString().toLowerCase()).toBe(
                    '0xd501881234567890abcdef64c08180830186a08009c0'.toLowerCase()
                );
            });
            test('ok <- should encode a zero gas price coef', () => {
                const txBody: TransactionBody = {
                    chainTag: 1,
                    blockRef: Hex.of('0x1234567890abcdef'),
                    expiration: 100,
                    clauses: [
                        new Clause(
                            Address.of(
                                '0x18596ed436016b30ec444Fc983DEDF16CF64057e'
                            ),
                            100n,
                            Hex.of('0x')
                        ),
                        new Clause(
                            Address.of(
                                '0x0000000000000000000000000000000000000000'
                            ),
                            50n
                        )
                    ],
                    gas: 100000n,
                    gasPriceCoef: 0n,
                    dependsOn: null,
                    nonce: 9n,
                    reserved: {
                        features: 0,
                        unused: []
                    }
                };
                const encoded =
                    TransactionBodyEncoder.encodeTransactionBody(txBody);
                expect(Hex.of(encoded).toString().toLowerCase()).toBe(
                    '0xf84401881234567890abcdef64f0d79418596ed436016b30ec444fc983dedf16cf64057e6480d7940000000000000000000000000000000000000000328080830186a08009c0'.toLowerCase()
                );
            });
        });
        describe('Dynamic Fee Transaction', () => {
            test('ok <- should encode a not signed, not delegated, no depends on tx', () => {
                const txBody: TransactionBody = {
                    chainTag: 1,
                    blockRef: Hex.of('0x1234567890abcdef'),
                    expiration: 100,
                    clauses: [
                        new Clause(
                            Address.of(
                                '0x18596ed436016b30ec444Fc983DEDF16CF64057e'
                            ),
                            100n,
                            Hex.of(
                                '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
                            )
                        ),
                        new Clause(
                            Address.of(
                                '0x0000000000000000000000000000000000000000'
                            ),
                            50n
                        )
                    ],
                    gas: 100000n,
                    maxFeePerGas: 1000000000n,
                    maxPriorityFeePerGas: 1000000000n,
                    dependsOn: null,
                    nonce: 9n,
                    reserved: {
                        features: 0,
                        unused: []
                    }
                };
                const encoded =
                    TransactionBodyEncoder.encodeTransactionBody(txBody);
                expect(Hex.of(encoded).toString().toLowerCase()).toBe(
                    '0x51f87701881234567890abcdef64f859f83f9418596ed436016b30ec444fc983dedf16cf64057e64a8abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890d79400000000000000000000000000000000000000003280843b9aca00843b9aca00830186a08009c0'.toLowerCase()
                );
            });
            test('ok <- should encode a not signed, fee delegated, no depends on tx', () => {
                const txBody: TransactionBody = {
                    chainTag: 1,
                    blockRef: Hex.of('0x1234567890abcdef'),
                    expiration: 100,
                    clauses: [
                        new Clause(
                            Address.of(
                                '0x18596ed436016b30ec444Fc983DEDF16CF64057e'
                            ),
                            100n,
                            Hex.of('0x123abc')
                        ),
                        new Clause(
                            Address.of(
                                '0x0000000000000000000000000000000000000000'
                            ),
                            50n
                        )
                    ],
                    gas: 100000n,
                    maxFeePerGas: 1000000000n,
                    maxPriorityFeePerGas: 0n,
                    dependsOn: null,
                    nonce: 9n,
                    reserved: {
                        features: 1,
                        unused: []
                    }
                };
                const encoded =
                    TransactionBodyEncoder.encodeTransactionBody(txBody);
                expect(Hex.of(encoded).toString().toLowerCase()).toBe(
                    '0x51f84d01881234567890abcdef64f3da9418596ed436016b30ec444fc983dedf16cf64057e6483123abcd7940000000000000000000000000000000000000000328080843b9aca00830186a08009c101'.toLowerCase()
                );
            });
            test('ok <- should encode a not signed, fee delegated, depends on tx', () => {
                const txBody: TransactionBody = {
                    chainTag: 1,
                    blockRef: Hex.of('0x1234567890abcdef'),
                    expiration: 100,
                    clauses: [
                        new Clause(
                            Address.of(
                                '0x18596ed436016b30ec444Fc983DEDF16CF64057e'
                            ),
                            100n,
                            Hex.of('0x')
                        ),
                        new Clause(
                            Address.of(
                                '0x0000000000000000000000000000000000000000'
                            ),
                            50n
                        )
                    ],
                    gas: 100000n,
                    maxFeePerGas: 2000000000n,
                    maxPriorityFeePerGas: 1000000000n,
                    dependsOn: Hex.of(
                        '0x6a8ffffede10451e6038ec8f8c4ceb99fe6c0007e996dcb095d5ff7abe022b6f'
                    ),
                    nonce: 9n,
                    reserved: {
                        features: 1,
                        unused: []
                    }
                };
                const encoded =
                    TransactionBodyEncoder.encodeTransactionBody(txBody);
                expect(Hex.of(encoded).toString().toLowerCase()).toBe(
                    '0x51f86e01881234567890abcdef64f0d79418596ed436016b30ec444fc983dedf16cf64057e6480d79400000000000000000000000000000000000000003280843b9aca008477359400830186a0a06a8ffffede10451e6038ec8f8c4ceb99fe6c0007e996dcb095d5ff7abe022b6f09c101'.toLowerCase()
                );
            });
            test('error <- should throw an error if a field is too large', () => {
                const txBody: TransactionBody = {
                    chainTag: 1,
                    blockRef: Hex.of(
                        '0x1234567890abcdef1234567890abcdef1234567890' // too large
                    ),
                    expiration: 100,
                    clauses: [
                        new Clause(
                            Address.of(
                                '0x18596ed436016b30ec444Fc983DEDF16CF64057e'
                            ),
                            100n,
                            Hex.of('0x')
                        ),
                        new Clause(
                            Address.of(
                                '0x0000000000000000000000000000000000000000'
                            ),
                            50n
                        )
                    ],
                    gas: 100000n,
                    maxFeePerGas: 1000000000n,
                    maxPriorityFeePerGas: 100n,
                    dependsOn: null,
                    nonce: 9n,
                    reserved: {
                        features: 0,
                        unused: []
                    }
                };
                expect(() =>
                    TransactionBodyEncoder.encodeTransactionBody(txBody)
                ).toThrow(RLPEncodingError);
            });
            test('ok <- should encode a not signed, not delegated, no depends on tx, no clauses', () => {
                const txBody: TransactionBody = {
                    chainTag: 1,
                    blockRef: Hex.of('0x1234567890abcdef'),
                    expiration: 100,
                    clauses: [],
                    gas: 100000n,
                    maxFeePerGas: 2000000000n,
                    maxPriorityFeePerGas: 1000000000n,
                    dependsOn: null,
                    nonce: 9n,
                    reserved: {
                        features: 0,
                        unused: []
                    }
                };
                const encoded =
                    TransactionBodyEncoder.encodeTransactionBody(txBody);
                expect(Hex.of(encoded).toString().toLowerCase()).toBe(
                    '0x51dd01881234567890abcdef64c0843b9aca008477359400830186a08009c0'.toLowerCase()
                );
            });
            test('ok <- should encode max priority fee per gas settings with zero value', () => {
                const txBody: TransactionBody = {
                    chainTag: 1,
                    blockRef: Hex.of('0x1234567890abcdef'),
                    expiration: 100,
                    clauses: [
                        new Clause(
                            Address.of(
                                '0x18596ed436016b30ec444Fc983DEDF16CF64057e'
                            ),
                            100n,
                            Hex.of('0x')
                        ),
                        new Clause(
                            Address.of(
                                '0x0000000000000000000000000000000000000000'
                            ),
                            50n
                        )
                    ],
                    gas: 100000n,
                    maxFeePerGas: 2000000000n,
                    maxPriorityFeePerGas: 0n,
                    dependsOn: Hex.of(
                        '0x6a8ffffede10451e6038ec8f8c4ceb99fe6c0007e996dcb095d5ff7abe022b6f'
                    ),
                    nonce: 9n,
                    reserved: {
                        features: 1,
                        unused: []
                    }
                };
                const encoded =
                    TransactionBodyEncoder.encodeTransactionBody(txBody);
                expect(Hex.of(encoded).toString().toLowerCase()).toBe(
                    '0x51f86a01881234567890abcdef64f0d79418596ed436016b30ec444fc983dedf16cf64057e6480d79400000000000000000000000000000000000000003280808477359400830186a0a06a8ffffede10451e6038ec8f8c4ceb99fe6c0007e996dcb095d5ff7abe022b6f09c101'.toLowerCase()
                );
            });
        });
    });
});
