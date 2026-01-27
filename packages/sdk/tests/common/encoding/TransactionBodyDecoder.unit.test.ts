import { Address, Hex } from '@common/vcdm';
import { TransactionBodyDecoder } from '@common/encoding/rlp/TransactionBodyDecoder';
import { TransactionBodyEncoder } from '@common/encoding/rlp/TransactionBodyEncoder';
import { describe, expect, test } from '@jest/globals';
import { TransactionRequest } from '@thor/thor-client/model/transactions/TransactionRequest';
import { TransactionBody } from '@thor/thor-client/model/transactions/TransactionBody';
import { Clause } from '@thor/thor-client/model/transactions/Clause';

/**
 * @group unit
 */
describe('TransactionRequestDecoder', () => {
    describe('decodeTransactionRequest', () => {
        describe('Legacy Transaction', () => {
            test('ok <- should decode a not signed, not delegated, no depends on tx', () => {
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
                const { body: decodedBody } = TransactionBodyDecoder.decode(
                    Hex.of(encoded)
                );
                // check fields
                expect(decodedBody.chainTag).toBe(txBody.chainTag);
                expect(decodedBody.blockRef.toString()).toBe(
                    txBody.blockRef.toString()
                );
                expect(decodedBody.expiration).toBe(txBody.expiration);
                expect(decodedBody.clauses.length).toBe(txBody.clauses.length);
                expect(decodedBody.gasPriceCoef).toBe(txBody.gasPriceCoef);
                expect(decodedBody.gas).toBe(txBody.gas);
                expect(decodedBody.dependsOn?.toString()).toBe(
                    txBody.dependsOn?.toString()
                );
                expect(decodedBody.nonce).toBe(txBody.nonce);
                expect(decodedBody.reserved?.features).toBe(
                    txBody.reserved?.features
                );
                expect(decodedBody.reserved?.unused).toEqual(
                    txBody.reserved?.unused
                );
                // check hash
                const encodedTx = TransactionRequest.of(txBody);
                const decodedTx = TransactionRequest.of(decodedBody);
                expect(decodedTx.hash.toString().toLowerCase()).toBe(
                    encodedTx.hash.toString().toLowerCase()
                );
            });
            test('ok <- should decode a not signed, fee delegated, no depends on tx', () => {
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
                const { body: decodedBody } = TransactionBodyDecoder.decode(
                    Hex.of(encoded)
                );
                // check fields
                expect(decodedBody.chainTag).toBe(txBody.chainTag);
                expect(decodedBody.blockRef.toString()).toBe(
                    txBody.blockRef.toString()
                );
                expect(decodedBody.expiration).toBe(txBody.expiration);
                expect(decodedBody.clauses.length).toBe(txBody.clauses.length);
                expect(decodedBody.gasPriceCoef).toBe(txBody.gasPriceCoef);
                expect(decodedBody.gas).toBe(txBody.gas);
                expect(decodedBody.dependsOn?.toString()).toBe(
                    txBody.dependsOn?.toString()
                );
                expect(decodedBody.nonce).toBe(txBody.nonce);
                expect(decodedBody.reserved?.features).toBe(
                    txBody.reserved?.features
                );
                expect(decodedBody.reserved?.unused).toEqual(
                    txBody.reserved?.unused
                );
                // check hash
                const encodedTx = TransactionRequest.of(txBody);
                const decodedTx = TransactionRequest.of(decodedBody);
                expect(decodedTx.hash.toString().toLowerCase()).toBe(
                    encodedTx.hash.toString().toLowerCase()
                );
            });
            test('ok <- should decode a not signed, fee delegated, depends on tx', () => {
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
                const tx = TransactionRequest.of(txBody);
                const encoded =
                    TransactionBodyEncoder.encodeTransactionBody(txBody);
                const { body: decodedBody } = TransactionBodyDecoder.decode(
                    Hex.of(encoded)
                );
                // check fields
                expect(decodedBody.chainTag).toBe(txBody.chainTag);
                expect(decodedBody.blockRef.toString()).toBe(
                    tx.blockRef.toString()
                );
                expect(decodedBody.expiration).toBe(txBody.expiration);
                expect(decodedBody.clauses.length).toBe(txBody.clauses.length);
                expect(decodedBody.gasPriceCoef).toBe(txBody.gasPriceCoef);
                expect(decodedBody.gas).toBe(txBody.gas);
                expect(decodedBody.dependsOn?.toString()).toBe(
                    tx.dependsOn?.toString()
                );
                expect(decodedBody.nonce).toBe(txBody.nonce);
                expect(decodedBody.reserved?.features).toBe(
                    txBody.reserved?.features
                );
                expect(decodedBody.reserved?.unused).toEqual(
                    txBody.reserved?.unused
                );
                // check hash
                const encodedTx = TransactionRequest.of(txBody);
                const decodedTx = TransactionRequest.of(decodedBody);
                expect(decodedTx.hash.toString().toLowerCase()).toBe(
                    encodedTx.hash.toString().toLowerCase()
                );
            });
            test('ok <- should decode a not signed, not delegated, no depends on tx, no clauses', () => {
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
                const { body: decodedBody } = TransactionBodyDecoder.decode(
                    Hex.of(encoded)
                );
                // check fields
                expect(decodedBody.chainTag).toBe(txBody.chainTag);
                expect(decodedBody.blockRef.toString()).toBe(
                    txBody.blockRef.toString()
                );
                expect(decodedBody.expiration).toBe(txBody.expiration);
                expect(decodedBody.clauses.length).toBe(txBody.clauses.length);
                expect(decodedBody.gasPriceCoef).toBe(txBody.gasPriceCoef);
                expect(decodedBody.gas).toBe(txBody.gas);
                expect(decodedBody.dependsOn?.toString()).toBe(
                    txBody.dependsOn?.toString()
                );
                expect(decodedBody.nonce).toBe(txBody.nonce);
                expect(decodedBody.reserved?.features).toBe(
                    txBody.reserved?.features
                );
                expect(decodedBody.reserved?.unused).toEqual(
                    txBody.reserved?.unused
                );
                // check hash
                const encodedTx = TransactionRequest.of(txBody);
                const decodedTx = TransactionRequest.of(decodedBody);
                expect(decodedTx.hash.toString().toLowerCase()).toBe(
                    encodedTx.hash.toString().toLowerCase()
                );
            });
            test('ok <- should decode a zero gas price coef', () => {
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
                const tx = TransactionRequest.of(txBody);
                const encoded =
                    TransactionBodyEncoder.encodeTransactionBody(txBody);
                const { body: decodedBody } = TransactionBodyDecoder.decode(
                    Hex.of(encoded)
                );
                // check fields
                expect(decodedBody.chainTag).toBe(txBody.chainTag);
                expect(decodedBody.blockRef.toString()).toBe(
                    tx.blockRef.toString()
                );
                expect(decodedBody.expiration).toBe(txBody.expiration);
                expect(decodedBody.clauses.length).toBe(tx.clauses.length);
                expect(decodedBody.gasPriceCoef).toBe(txBody.gasPriceCoef);
                expect(decodedBody.gas).toBe(txBody.gas);
                expect(decodedBody.dependsOn?.toString()).toBe(
                    tx.dependsOn?.toString()
                );
                expect(decodedBody.nonce).toBe(txBody.nonce);
                expect(decodedBody.reserved?.features).toBe(
                    txBody.reserved?.features
                );
                expect(decodedBody.reserved?.unused).toEqual(
                    txBody.reserved?.unused
                );
                // check hash
                const encodedTx = TransactionRequest.of(txBody);
                const decodedTx = TransactionRequest.of(decodedBody);
                expect(decodedTx.hash.toString().toLowerCase()).toBe(
                    encodedTx.hash.toString().toLowerCase()
                );
            });
        });
        describe('Dynamic Fee Transaction', () => {
            test('ok <- should decode a not signed, not delegated, no depends on tx', () => {
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
                const tx = TransactionRequest.of(txBody);
                const encoded =
                    TransactionBodyEncoder.encodeTransactionBody(txBody);
                const { body: decodedBody } = TransactionBodyDecoder.decode(
                    Hex.of(encoded)
                );
                // check fields
                expect(decodedBody.chainTag).toBe(txBody.chainTag);
                expect(decodedBody.blockRef.toString()).toBe(
                    tx.blockRef.toString()
                );
                expect(decodedBody.expiration).toBe(txBody.expiration);
                expect(decodedBody.clauses.length).toBe(txBody.clauses.length);
                expect(decodedBody.maxFeePerGas).toBe(txBody.maxFeePerGas);
                expect(decodedBody.maxPriorityFeePerGas).toBe(
                    tx.maxPriorityFeePerGas
                );
                expect(decodedBody.gas).toBe(txBody.gas);
                expect(decodedBody.dependsOn?.toString()).toBe(
                    tx.dependsOn?.toString()
                );
                expect(decodedBody.nonce).toBe(txBody.nonce);
                expect(decodedBody.reserved?.features).toBe(
                    txBody.reserved?.features
                );
                expect(decodedBody.reserved?.unused).toEqual(
                    txBody.reserved?.unused
                );
                // check hash
                const encodedTx = TransactionRequest.of(txBody);
                const decodedTx = TransactionRequest.of(decodedBody);
                expect(decodedTx.hash.toString().toLowerCase()).toBe(
                    encodedTx.hash.toString().toLowerCase()
                );
            });
            test('ok <- should decode a not signed, fee delegated, no depends on tx', () => {
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
                const tx = TransactionRequest.of(txBody);
                const encoded =
                    TransactionBodyEncoder.encodeTransactionBody(txBody);
                const { body: decodedBody } = TransactionBodyDecoder.decode(
                    Hex.of(encoded)
                );
                // check fields
                expect(decodedBody.chainTag).toBe(txBody.chainTag);
                expect(decodedBody.blockRef.toString()).toBe(
                    tx.blockRef.toString()
                );
                expect(decodedBody.expiration).toBe(txBody.expiration);
                expect(decodedBody.clauses.length).toBe(txBody.clauses.length);
                expect(decodedBody.maxFeePerGas).toBe(txBody.maxFeePerGas);
                expect(decodedBody.maxPriorityFeePerGas).toBe(
                    tx.maxPriorityFeePerGas
                );
                expect(decodedBody.gas).toBe(txBody.gas);
                expect(decodedBody.dependsOn?.toString()).toBe(
                    tx.dependsOn?.toString()
                );
                expect(decodedBody.nonce).toBe(txBody.nonce);
                expect(decodedBody.reserved?.features).toBe(
                    txBody.reserved?.features
                );
                expect(decodedBody.reserved?.unused).toEqual(
                    txBody.reserved?.unused
                );
                // check hash
                const encodedTx = TransactionRequest.of(txBody);
                const decodedTx = TransactionRequest.of(decodedBody);
                expect(decodedTx.hash.toString().toLowerCase()).toBe(
                    encodedTx.hash.toString().toLowerCase()
                );
            });
            test('ok <- should decode a not signed, fee delegated, depends on tx', () => {
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
                const tx = TransactionRequest.of(txBody);
                const encoded =
                    TransactionBodyEncoder.encodeTransactionBody(txBody);
                const { body: decodedBody } = TransactionBodyDecoder.decode(
                    Hex.of(encoded)
                );
                // check fields
                expect(decodedBody.chainTag).toBe(txBody.chainTag);
                expect(decodedBody.blockRef.toString()).toBe(
                    tx.blockRef.toString()
                );
                expect(decodedBody.expiration).toBe(txBody.expiration);
                expect(decodedBody.clauses.length).toBe(txBody.clauses.length);
                expect(decodedBody.maxFeePerGas).toBe(txBody.maxFeePerGas);
                expect(decodedBody.maxPriorityFeePerGas).toBe(
                    txBody.maxPriorityFeePerGas
                );
                expect(decodedBody.gas).toBe(txBody.gas);
                expect(decodedBody.dependsOn?.toString()).toBe(
                    tx.dependsOn?.toString()
                );
                expect(decodedBody.nonce).toBe(txBody.nonce);
                expect(decodedBody.reserved?.features).toBe(
                    txBody.reserved?.features
                );
                expect(decodedBody.reserved?.unused).toEqual(
                    txBody.reserved?.unused
                );
                // check hash
                const encodedTx = TransactionRequest.of(txBody);
                const decodedTx = TransactionRequest.of(decodedBody);
                expect(decodedTx.hash.toString().toLowerCase()).toBe(
                    encodedTx.hash.toString().toLowerCase()
                );
            });
            test('ok <- should decode a not signed, not delegated, no depends on tx, no clauses', () => {
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
                const tx = TransactionRequest.of(txBody);
                const encoded =
                    TransactionBodyEncoder.encodeTransactionBody(txBody);
                const { body: decodedBody } = TransactionBodyDecoder.decode(
                    Hex.of(encoded)
                );
                // check fields
                expect(decodedBody.chainTag).toBe(txBody.chainTag);
                expect(decodedBody.blockRef.toString()).toBe(
                    tx.blockRef.toString()
                );
                expect(decodedBody.expiration).toBe(txBody.expiration);
                expect(decodedBody.clauses.length).toBe(txBody.clauses.length);
                expect(decodedBody.maxFeePerGas).toBe(txBody.maxFeePerGas);
                expect(decodedBody.maxPriorityFeePerGas).toBe(
                    tx.maxPriorityFeePerGas
                );
                expect(decodedBody.gas).toBe(txBody.gas);
                expect(decodedBody.dependsOn?.toString()).toBe(
                    tx.dependsOn?.toString()
                );
                expect(decodedBody.nonce).toBe(txBody.nonce);
                expect(decodedBody.reserved?.features).toBe(
                    txBody.reserved?.features
                );
                expect(decodedBody.reserved?.unused).toEqual(
                    txBody.reserved?.unused
                );
                // check hash
                const encodedTx = TransactionRequest.of(txBody);
                const decodedTx = TransactionRequest.of(decodedBody);
                expect(decodedTx.hash.toString().toLowerCase()).toBe(
                    encodedTx.hash.toString().toLowerCase()
                );
            });
            test('ok <- should decode max priority fee per gas settings with zero value', () => {
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
                const tx = TransactionRequest.of(txBody);
                const encoded =
                    TransactionBodyEncoder.encodeTransactionBody(txBody);
                const { body: decodedBody } = TransactionBodyDecoder.decode(
                    Hex.of(encoded)
                );
                // check fields
                expect(decodedBody.chainTag).toBe(txBody.chainTag);
                expect(decodedBody.blockRef.toString()).toBe(
                    tx.blockRef.toString()
                );
                expect(decodedBody.expiration).toBe(txBody.expiration);
                expect(decodedBody.clauses.length).toBe(txBody.clauses.length);
                expect(decodedBody.maxFeePerGas).toBe(txBody.maxFeePerGas);
                expect(decodedBody.maxPriorityFeePerGas).toBe(
                    tx.maxPriorityFeePerGas
                );
                expect(decodedBody.gas).toBe(txBody.gas);
                expect(decodedBody.dependsOn?.toString()).toBe(
                    tx.dependsOn?.toString()
                );
                expect(decodedBody.nonce).toBe(txBody.nonce);
                expect(decodedBody.reserved?.features).toBe(
                    txBody.reserved?.features
                );
                expect(decodedBody.reserved?.unused).toEqual(
                    txBody.reserved?.unused
                );
                // check hash
                const encodedTx = TransactionRequest.of(txBody);
                const decodedTx = TransactionRequest.of(decodedBody);
                expect(decodedTx.hash.toString().toLowerCase()).toBe(
                    encodedTx.hash.toString().toLowerCase()
                );
            });
        });
    });
});
