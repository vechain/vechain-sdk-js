import { describe, expect, test } from '@jest/globals';
import { Address, Hex, HexUInt, Secp256k1 } from '@common';
import { PrivateKeySigner, Transaction } from '@thor';
import { Clause, TransactionRequest } from '@thor/thor-client';
import { type ThorSoloAccount } from '@vechain/sdk-solo-setup';
import { concatBytes } from '@noble/curves/utils.js';

/**
 * @group unit/thor/signer
 */
describe('PrivateKeySigner UNIT test', () => {
    const mockSenderAccount = {
        privateKey:
            '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
        address: '0x3db469a79593dcc67f07DE1869d6682fC1eaf535'
    } satisfies ThorSoloAccount;
    const mockReceiverAccount = {
        privateKey:
            '62183dac319418f40e47dec7b60f104d0d6a9e248860b005e8b6d36cf9e8f11a',
        address: '0x9E4E0efb170070e35A6b76b683aEE91dd77805B3'
    } satisfies ThorSoloAccount;

    const mockBlockRef = HexUInt.of('0x000000b7b1994856');
    const mockChainTag = 246;
    const mockExpiration = 32;
    const mockGas = 25000n;
    const mockGasPriceCoef = 128n; // 123n
    const mockMaxFeePerGas = 10027000000000n; // 20 Gwei
    const mockMaxPriorityFeePerGas = 27000000000n; // 5 Gwei
    const mockNonce = 3;
    const mockValue = 10n ** 15n; // .001 VET

    describe('sign', () => {
        test('ok <- dynamic fee - no sponsored', () => {
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: 0n, // Dynamic fee transactions use 0
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
            });
            expect(txRequest.isSigned).toBe(false);
            // Sign as Sender. Finalized signature.
            const signer = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestSaS = signer.sign(txRequest);
            expect(txRequestSaS.isSigned).toBe(true);
            expect(txRequestSaS.originSignature).toEqual(
                txRequestSaS.signature
            );
        });

        test('ok <- dynamic fee - signed then sponsored', () => {
            const txRequest = new TransactionRequest({
                beggar: Address.of(mockSenderAccount.address),
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: 0n, // Dynamic fee transactions use 0
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
            });
            expect(txRequest.isSigned).toBe(false);
            expect(txRequest.isSigned).toBe(false);
            // Sign as Sender. Partial signature.
            const originSIgner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestSaS = originSIgner.sign(txRequest);
            expect(txRequestSaS.originSignature.length).toBe(
                Secp256k1.SIGNATURE_LENGTH
            );
            expect(txRequestSaS.isSigned).toBe(false);
            // Sign as Gas Payer. Finalized signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const txRequestSaGP = gasPayerSigner.sign(txRequestSaS);
            expect(txRequestSaGP.gasPayerSignature.length).toBe(
                Secp256k1.SIGNATURE_LENGTH
            );
            expect(txRequestSaGP.isSigned).toBe(true);
            expect(txRequestSaGP.signature).toEqual(
                concatBytes(
                    txRequestSaGP.originSignature,
                    txRequestSaGP.gasPayerSignature
                )
            );
        });

        test('ok <- dynamic fee - sponsored than signed', () => {
            const txRequest = new TransactionRequest({
                beggar: Address.of(mockSenderAccount.address),
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: 0n, // Dynamic fee transactions use 0
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
            });
            // Sign as Gas Payer. Partial signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const txRequestSaGP = gasPayerSigner.sign(txRequest);
            expect(txRequestSaGP.gasPayerSignature.length).toBe(
                Secp256k1.SIGNATURE_LENGTH
            );
            expect(txRequestSaGP.isSigned).toBe(false);
            // Sign as Sender. Finalized signature.
            const originSIgner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestSaS = originSIgner.sign(txRequestSaGP);
            expect(txRequestSaS.originSignature.length).toBe(
                Secp256k1.SIGNATURE_LENGTH
            );
            expect(txRequestSaS.isSigned).toBe(true);
            expect(txRequestSaS.signature).toEqual(
                concatBytes(
                    txRequestSaS.originSignature,
                    txRequestSaS.gasPayerSignature
                )
            );
        });

        test('ok <- dynamic fee - x-flow aka ghostbuster test', () => {
            const txRequest = new TransactionRequest({
                beggar: Address.of(mockSenderAccount.address),
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: 0n, // Dynamic fee transactions use 0
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
            });

            // Sign as Gas Payer. Partial signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const originSIgner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const sponsoredAndSigned = originSIgner.sign(
                gasPayerSigner.sign(txRequest)
            );
            const signedAnsSponsored = gasPayerSigner.sign(
                originSIgner.sign(txRequest)
            );
            expect(sponsoredAndSigned.toJSON()).toEqual(
                signedAnsSponsored.toJSON()
            );
        });

        test('ok <- legacy - no sponsored', () => {
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            });
            expect(txRequest.isSigned).toBe(false);
            // Sign as Sender. Finalized signature.
            const signer = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestSaS = signer.sign(txRequest);
            expect(txRequestSaS.isSigned).toBe(true);
            expect(txRequestSaS.originSignature).toEqual(
                txRequestSaS.signature
            );
        });

        test('ok <- legacy - signed then sponsored', () => {
            const txRequest = new TransactionRequest({
                beggar: Address.of(mockSenderAccount.address),
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            });
            expect(txRequest.isSigned).toBe(false);
            // Sign as Sender. Partial signature.
            const originSIgner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestSaS = originSIgner.sign(txRequest);
            expect(txRequestSaS.originSignature.length).toBe(
                Secp256k1.SIGNATURE_LENGTH
            );
            expect(txRequestSaS.isSigned).toBe(false);
            // Sign as Gas Payer. Finalized signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const txRequestSaGP = gasPayerSigner.sign(txRequestSaS);
            expect(txRequestSaGP.gasPayerSignature.length).toBe(
                Secp256k1.SIGNATURE_LENGTH
            );
            expect(txRequestSaGP.isSigned).toBe(true);
            expect(txRequestSaGP.signature).toEqual(
                concatBytes(
                    txRequestSaGP.originSignature,
                    txRequestSaGP.gasPayerSignature
                )
            );
        });

        test('ok <- legacy - sponsored then signed', () => {
            const txRequest = new TransactionRequest({
                beggar: Address.of(mockSenderAccount.address),
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            });
            expect(txRequest.isSigned).toBe(false);
            // Sign as Gas Payer. Partial signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const txRequestSaGP = gasPayerSigner.sign(txRequest);
            expect(txRequestSaGP.gasPayerSignature.length).toBe(
                Secp256k1.SIGNATURE_LENGTH
            );
            expect(txRequestSaGP.isSigned).toBe(false);
            // Sign as Sender. Finalized signature.
            const originSIgner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestSaS = originSIgner.sign(txRequestSaGP);
            expect(txRequestSaS.originSignature.length).toBe(
                Secp256k1.SIGNATURE_LENGTH
            );
            expect(txRequestSaS.isSigned).toBe(true);
            expect(txRequestSaS.signature).toEqual(
                concatBytes(
                    txRequestSaS.originSignature,
                    txRequestSaS.gasPayerSignature
                )
            );
        });

        test('ok <- legacy - x-flow aka ghostbuster test', () => {
            const txRequest = new TransactionRequest({
                beggar: Address.of(mockSenderAccount.address),
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            });

            // Sign as Gas Payer. Partial signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const originSIgner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const sponsoredAndSigned = originSIgner.sign(
                gasPayerSigner.sign(txRequest)
            );
            const signedAnsSponsored = gasPayerSigner.sign(
                originSIgner.sign(txRequest)
            );
            expect(sponsoredAndSigned.toJSON()).toEqual(
                signedAnsSponsored.toJSON()
            );
        });


        test('OLD VS NEW MODEL COMPATIBILITY', () => {
            const txRequest = new TransactionRequest({
                beggar: Address.of(mockSenderAccount.address),
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            });

            const tx = Transaction.of({
                chainTag: txRequest.chainTag,
                blockRef: txRequest.blockRef.toString(),
                expiration: txRequest.expiration,
                clauses: txRequest.clauses.map((clause: Clause) => ({
                    to: clause.to?.toString() ?? null,
                    value: clause.value,
                    data: clause.data?.toString() ?? Hex.PREFIX
                })),
                gasPriceCoef: Number(txRequest.gasPriceCoef),
                gas: Number(txRequest.gas),
                dependsOn: txRequest.dependsOn?.toString() ?? null,
                nonce: txRequest.nonce,
                reserved: {
                    features: 1
                }
            });
            // Sign as Sender. Partial signature.
            const txSaS = tx.signAsSender(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const originSIgner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestSaS = originSIgner.sign(txRequest);
            expect(txSaS.senderSignature).toEqual(txRequestSaS.originSignature);
            // Sign as Gas Payer. Finalized signature.
            const txSaGP = txSaS.signAsGasPayer(
                Address.of(mockSenderAccount.address),
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const txRequestSaGP = gasPayerSigner.sign(txRequestSaS);
            expect(txSaGP.gasPayerSignature).toEqual(
                txRequestSaGP.gasPayerSignature
            );
            expect(txSaGP.signature).toEqual(txRequestSaGP.signature);
        });
    });
});
