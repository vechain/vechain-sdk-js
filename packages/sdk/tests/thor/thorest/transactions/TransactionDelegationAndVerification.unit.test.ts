import { describe, expect, test } from '@jest/globals';
import { Address, BlockRef, HexUInt } from '@common/vcdm';
import {
    ClauseBuilder,
    Transaction,
    type TransactionBody
} from '@thor/thorest';
import { networkInfo } from '@thor/utils';
import { Secp256k1 } from '@common/cryptography/secp256k1';
import {
    type GetTxReceiptResponseJSON,
    type TXIDJSON
} from '@thor/thorest/json';
import { type HttpPath } from '@common/http';
import { mockHttpClient } from '../../../MockHttpClient';
import { secp256k1 as nc_secp256k1 } from '@noble/curves/secp256k1';

/**
 * VeChain transaction - unit
 *
 * @group unit/transaction
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
    const OneVET = 10n ** 18n;
    const clauses = [ClauseBuilder.transferVET(receiver.address, OneVET)];

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

        const body: TransactionBody = {
            chainTag: networkInfo.solo.chainTag,
            blockRef: BlockRef.of(mockBlockResponse.id).toString(),
            expiration: 0,
            clauses,
            gasPriceCoef: 0,
            gas: mockGasResponse.totalGas,
            dependsOn: null,
            nonce: 2,
            reserved: {
                features: 1
            }
        };

        const tx = Transaction.of(body).signAsSenderAndGasPayer(
            sender.privateKey.bytes,
            gasPayer.privateKey.bytes
        );

        const mockClient = mockHttpClient<TXIDJSON>(mockTxResponse, 'post');
        const txResult = await mockClient.post(
            '/transactions' as unknown as HttpPath,
            {
                query: HexUInt.of(tx.encoded).toString()
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
        const txA = Transaction.of({
            chainTag: networkInfo.solo.chainTag,
            blockRef: latestBlock?.id.slice(0, 18) ?? '0x0',
            expiration: 0,
            clauses,
            gasPriceCoef: 0,
            gas: gasToPay.totalGas,
            dependsOn: null,
            nonce: 1,
            reserved: {
                features: 1 // set the transaction to be delegated
            }
        });
        const as = txA.signAsSender(sender.privateKey.bytes);
        const ap = as.signAsGasPayer(sender.address, gasPayer.privateKey.bytes);
        const sigmaA = nc_secp256k1.Signature.fromCompact(
            ap.signature?.slice(-65).slice(0, 64) as Uint8Array
        );
        const hashA = ap.getTransactionHash(sender.address).bytes;
        const isVerifiedA = nc_secp256k1.verify(
            sigmaA,
            hashA,
            gasPayerPublicKey
        );
        expect(isVerifiedA).toBe(true);

        const txB = Transaction.of({
            chainTag: networkInfo.solo.chainTag,
            blockRef: BlockRef.of(latestBlock.id).toString(),
            expiration: 0,
            clauses,
            gasPriceCoef: 0,
            gas: gasToPay.totalGas,
            dependsOn: null,
            nonce: 2,
            reserved: {
                features: 1 // set the transaction to be delegated
            }
        });
        const bs = txB.signAsSender(sender.privateKey.bytes);
        const bp = bs.signAsGasPayer(sender.address, gasPayer.privateKey.bytes);
        const sigmaB = nc_secp256k1.Signature.fromCompact(
            bp.signature?.slice(-65).slice(0, 64) as Uint8Array
        );
        const hashB = bp.getTransactionHash(sender.address).bytes;
        const isVerifiedB = nc_secp256k1.verify(
            sigmaB,
            hashB,
            gasPayerPublicKey
        );
        expect(isVerifiedB).toBe(true);

        const isVerifiedForge = nc_secp256k1.verify(
            sigmaA,
            hashB,
            gasPayerPublicKey
        );
        expect(isVerifiedForge).toBe(false);
    });
});
