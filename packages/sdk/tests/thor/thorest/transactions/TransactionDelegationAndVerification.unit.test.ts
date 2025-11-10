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
            gasSponsorshipRequester: sender.address,
            chainTag: mockChainTag,
            blockRef: BlockRef.of(mockBlockResponse.id),
            expiration: 0,
            clauses,
            gasPriceCoef: 0n,
            gas: BigInt(mockGasResponse.totalGas),
            dependsOn: null,
            nonce: 2
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
        const txA = new TransactionRequest({
            gasSponsorshipRequester: sender.address,
            chainTag: mockChainTag,
            blockRef: BlockRef.of(latestBlock.id),
            expiration: 0,
            clauses,
            gasPriceCoef: 0n,
            gas: BigInt(gasToPay.totalGas),
            dependsOn: null,
            nonce: 1
        });
        const senderSigner = new PrivateKeySigner(sender.privateKey.bytes);
        const gasPayerSigner = new PrivateKeySigner(gasPayer.privateKey.bytes);
        const as = senderSigner.sign(txA);
        const ap = gasPayerSigner.sign(as);
        const sigmaA = nc_secp256k1.Signature.fromCompact(
            ap.signature?.slice(-65).slice(0, 64) as Uint8Array
        );
        const hashA = Blake2b256.of(
            concatBytes(
                ap.hash.bytes, // Origin hash.
                ap.gasSponsorshipRequester?.bytes ?? new Uint8Array()
            )
        ).bytes; // Gas payer hash.
        const isVerifiedA = nc_secp256k1.verify(
            sigmaA.toBytes(),
            hashA,
            gasPayerPublicKey
        );
        expect(isVerifiedA).toBe(true);

        const txB = new TransactionRequest({
            gasSponsorshipRequester: sender.address,
            chainTag: mockChainTag,
            blockRef: BlockRef.of(latestBlock.id),
            expiration: 0,
            clauses,
            gasPriceCoef: 0n,
            gas: BigInt(gasToPay.totalGas),
            dependsOn: null,
            nonce: 2
        });
        const bs = senderSigner.sign(txB);
        const bp = gasPayerSigner.sign(bs);
        const sigmaB = nc_secp256k1.Signature.fromCompact(
            bp.signature?.slice(-65).slice(0, 64) as Uint8Array
        );
        const hashB = Blake2b256.of(
            concatBytes(
                bp.hash.bytes, // Origin hash.
                bp.gasSponsorshipRequester?.bytes ?? new Uint8Array()
            )
        ).bytes; // Gas payer hash.
        const isVerifiedB = nc_secp256k1.verify(
            sigmaB.toBytes(),
            hashB,
            gasPayerPublicKey
        );
        expect(isVerifiedB).toBe(true);

        const isVerifiedForge = nc_secp256k1.verify(
            sigmaA.toBytes(),
            hashB,
            gasPayerPublicKey
        );
        expect(isVerifiedForge).toBe(false);
    });
});
