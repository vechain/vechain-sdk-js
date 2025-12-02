import { Address, Blake2b256, BlockRef, HexUInt } from '@common/vcdm';
import { ClauseBuilder } from '@thor/thor-client/transactions';
import { PrivateKeySigner } from '@thor';
import { Secp256k1 } from '@common/cryptography/secp256k1';
import { TransactionRequest } from '@thor/thor-client';
import { concatBytes } from '@noble/curves/utils.js';
import { describe, expect, test } from '@jest/globals';
import { mockHttpClient } from '../../../MockHttpClient';
import { secp256k1 as nc_secp256k1 } from '@noble/curves/secp256k1';
import { type HttpPath } from '@common/http';
import {
    type GetTxReceiptResponseJSON,
    type TXIDJSON
} from '@thor/thorest/json';

/**
 * VeChain transaction - unit
 *
 * @group unit/thor/transaction
 */
describe('unit tests', () => {
    const sender = {
        privateKey: HexUInt.of(
            'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5'
        ),
        address: Address.of('0x2669514f9fe96bc7301177ba774d3da8a06cace4')
    };
    const receiver = {
        address: Address.of('0x9e7911de289c3c856ce7f421034f66b6cde49c39')
    };
    const gasPayer = {
        privateKey: HexUInt.of(
            '432f38bcf338c374523e83fdb2ebe1030aba63c7f1e81f7d76c5f53f4d42e766'
        ),
        address: Address.of('0x88b2551c3ed42ca663796c10ce68c88a65f73fe2')
    };
    const mockChainTag = 0xf6;

    const OneVET = 10n ** 18n;
    const clauses = [
        ClauseBuilder.getTransferVetClause(receiver.address, OneVET)
    ];

    test('Delegated Tx', async () => {
        const mockBlockResponse = {
            id: '0x0000000000000000000000000000000000000000000000000000000000000123'
        };
        const mockGasResponse = {
            totalGas: 21000,
            reverted: false,
            revertReasons: [],
            vmErrors: []
        };
        const mockTxResponse = {
            id: '0x0000000000000000000000000000000000000000000000000000000000000456'
        } satisfies TXIDJSON;
        const mockTxReceiptResponse = {
            type: null,
            gasUsed: '21000',
            gasPayer: gasPayer.address.toString(),
            paid: '0x0',
            reward: '0x0',
            reverted: false,
            meta: {
                blockID:
                    '0x0000000000000000000000000000000000000000000000000000000000000789',
                blockNumber: 1,
                blockTimestamp: 1000000,
                txID: '0x0000000000000000000000000000000000000000000000000000000000000456',
                txOrigin: sender.address.toString()
            },
            outputs: []
        } satisfies GetTxReceiptResponseJSON;

        const txRequest = new TransactionRequest({
            beggar: sender.address,
            chainTag: mockChainTag,
            blockRef: BlockRef.of(mockBlockResponse.id),
            expiration: 0,
            clauses,
            gasPriceCoef: 0n,
            gas: BigInt(mockGasResponse.totalGas),
            dependsOn: null,
            nonce: 2n
        });

        const senderSigner = new PrivateKeySigner(sender.privateKey.bytes);
        const gasPayerSigner = new PrivateKeySigner(gasPayer.privateKey.bytes);
        const signedTxRequest = gasPayerSigner.sign(
            senderSigner.sign(txRequest)
        );

        const mockClient = mockHttpClient<TXIDJSON>(mockTxResponse, 'post');
        const txResult = await mockClient.post(
            '/transactions' as unknown as HttpPath,
            {
                query: HexUInt.of(signedTxRequest.encoded).toString()
            }
        );
        expect(await txResult.json()).toEqual(mockTxResponse);

        const mockReceiptClient = mockHttpClient<GetTxReceiptResponseJSON>(
            mockTxReceiptResponse,
            'get'
        );
        const txReceipt = await mockReceiptClient.get(
            '/transactions/receipt' as unknown as HttpPath,
            {
                query: mockTxResponse.id
            }
        );
        expect(await txReceipt.json()).toEqual(mockTxReceiptResponse);
    });

    test('verify signatures', () => {
        const latestBlock = {
            id: '0x0000000000000000000000000000000000000000000000000000000000000123'
        };
        const gasToPay = { totalGas: 21000 };
        const gasPayerPublicKey = Secp256k1.derivePublicKey(
            gasPayer.privateKey.bytes,
            false
        );
        const senderPublicKey = Secp256k1.derivePublicKey(
            sender.privateKey.bytes,
            false
        );
        const txRequest = new TransactionRequest({
            chainTag: mockChainTag,
            blockRef: BlockRef.of(latestBlock.id),
            expiration: 0,
            clauses,
            gasPriceCoef: 0n,
            gas: BigInt(gasToPay.totalGas),
            dependsOn: null,
            nonce: 1n,
            reserved: {
                features: 1,
                unused: []
            }
        });
        const senderSigner = new PrivateKeySigner(sender.privateKey.bytes);
        const gasPayerSigner = new PrivateKeySigner(gasPayer.privateKey.bytes);
        const txSenderSigned = senderSigner.sign(txRequest);
        const senderSignature = txSenderSigned.signature?.slice(
            0,
            64
        ) as Uint8Array;
        const txSenderAndGasPayerSigned = gasPayerSigner.sign(
            txSenderSigned,
            sender.address
        );
        const gasPayerSignature = nc_secp256k1.Signature.fromCompact(
            txSenderAndGasPayerSigned.signature
                ?.slice(-65)
                .slice(0, 64) as Uint8Array
        );
        // verify sender signature is recoverable from the signing hash and sender public key
        const isSenderSignatureVerified = nc_secp256k1.verify(
            senderSignature ?? new Uint8Array(),
            txRequest.hash.bytes,
            senderPublicKey
        );
        expect(isSenderSignatureVerified).toBe(true);

        // verify gas payer signature is recoverable from the gas payer hash and gas payer public key
        const gasPayerHash = Blake2b256.of(
            concatBytes(
                txRequest.hash.bytes, // unsigned hash
                sender.address.bytes ?? new Uint8Array() // sender address
            )
        ).bytes;
        const isGasPayerSignatureVerified = nc_secp256k1.verify(
            gasPayerSignature.toBytes(),
            gasPayerHash,
            gasPayerPublicKey
        );
        expect(isGasPayerSignatureVerified).toBe(true);

        // repeat for non-delegated transaction
        const txRequestNonDelegated = new TransactionRequest({
            chainTag: mockChainTag,
            blockRef: BlockRef.of(latestBlock.id),
            expiration: 0,
            clauses,
            gasPriceCoef: 0n,
            gas: BigInt(gasToPay.totalGas),
            dependsOn: null,
            nonce: 2n
        });
        const txSenderSignedNonDelegated = senderSigner.sign(
            txRequestNonDelegated
        );
        const senderSignatureNonDelegated =
            txSenderSignedNonDelegated.signature?.slice(0, 64) as Uint8Array;
        const txSenderAndGasPayerSignedNonDelegated = gasPayerSigner.sign(
            txSenderSignedNonDelegated,
            sender.address
        );
        const gasPayerSignatureNonDelegated =
            nc_secp256k1.Signature.fromCompact(
                txSenderAndGasPayerSignedNonDelegated.signature
                    ?.slice(-65)
                    .slice(0, 64) as Uint8Array
            );
        // verify sender signature is recoverable from the signing hash and sender public key
        const isSenderSignatureVerifiedNonDelegated = nc_secp256k1.verify(
            senderSignatureNonDelegated,
            txRequestNonDelegated.hash.bytes,
            senderPublicKey
        );
        expect(isSenderSignatureVerifiedNonDelegated).toBe(true);
        // verify gas payer signature is recoverable from the gas payer hash and gas payer public key
        const isGasPayerSignatureVerifiedNonDelegated = nc_secp256k1.verify(
            gasPayerSignatureNonDelegated.toBytes(),
            txRequestNonDelegated.hash.bytes,
            gasPayerPublicKey
        );
        expect(isGasPayerSignatureVerifiedNonDelegated).toBe(true);
    });
});
