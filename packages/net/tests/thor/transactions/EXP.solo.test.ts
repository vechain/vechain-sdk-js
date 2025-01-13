import { describe, test } from '@jest/globals';
import {
    Address,
    Clause,
    HexUInt,
    networkInfo,
    Transaction,
    type TransactionBody,
    VET
} from '../../../../core/src';
import { THOR_SOLO_URL, ThorClient } from '../../../../network/src';

import { secp256k1 as nc_secp256k1 } from '@noble/curves/secp256k1';
import { Secp256k1 } from '@vechain/sdk-core';

describe('Solo Experiments', () => {
    const thorClient = ThorClient.at(THOR_SOLO_URL + '/', {
        isPollingEnabled: false
    });
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
    const OneVET = VET.of(1);
    const clauses = [Clause.transferVET(receiver.address, OneVET)];

    test('Delegated Tx', async () => {
        const latestBlock = await thorClient.blocks.getBestBlockCompressed();
        console.log(latestBlock);
        const gasToPay = await thorClient.gas.estimateGas(
            clauses,
            sender.address.toString()
        );
        console.log(gasToPay);
        const body: TransactionBody = {
            chainTag: networkInfo.solo.chainTag,
            blockRef: latestBlock?.id.slice(0, 18) ?? '0x0',
            expiration: 0,
            clauses,
            gasPriceCoef: 0,
            gas: gasToPay.totalGas,
            dependsOn: null,
            nonce: 2,
            reserved: {
                features: 1 // set the transaction to be delegated
            }
        };
        const tx = Transaction.of(body).signAsSenderAndGasPayer(
            sender.privateKey.bytes,
            gasPayer.privateKey.bytes
        );
        console.log(tx.signature?.length);
        const txResult = await thorClient.transactions.sendRawTransaction(
            HexUInt.of(tx.encoded).toString()
        );
        console.log(txResult);
        const txReceipt = await thorClient.transactions.waitForTransaction(
            tx.id.toString()
        );
        console.log(txReceipt);
    }, 60000);

    test('NCC Tx', async () => {
        const latestBlock = await thorClient.blocks.getBestBlockCompressed();
        const gasToPay = await thorClient.gas.estimateGas(
            clauses,
            sender.address.toString()
        );
        const body: TransactionBody = {
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
        };
        const tx = Transaction.of(body).signAsSenderAndGasPayer(
            sender.privateKey.bytes,
            gasPayer.privateKey.bytes
        );
        // KEEP IT
        // console.log(tx.signature?.length);
        // const txResult = await thorClient.transactions.sendRawTransaction(
        //     HexUInt.of(tx.encoded).toString()
        // );
        // console.log(txResult);
        const aBody: TransactionBody = {
            chainTag: networkInfo.solo.chainTag,
            blockRef: latestBlock?.id.slice(0, 18) ?? '0x0',
            expiration: 0,
            clauses,
            gasPriceCoef: 0,
            gas: gasToPay.totalGas,
            dependsOn: null,
            nonce: 2,
            reserved: {
                features: 1 // set the transaction to be delegated
            }
        };
        const aTx = Transaction.of(aBody).signAsSender(sender.privateKey.bytes);
        // KEEP IT
        // const sig = nc_utils.concatBytes(
        //     aTx.signature as Uint8Array,
        //     (tx.signature as Uint8Array).slice(65)
        // );
        const fTx = Transaction.of(aTx.body, tx.signature);
        const fTxResult = await thorClient.transactions.sendRawTransaction(
            HexUInt.of(fTx.encoded).toString()
        );
        console.log(fTxResult);
    }, 60000);

    test('verify', async () => {
        const latestBlock = await thorClient.blocks.getBestBlockCompressed();
        const gasToPay = await thorClient.gas.estimateGas(
            clauses,
            sender.address.toString()
        );
        // KEEP IT
        // const senderPublicKey = Secp256k1.derivePublicKey(
        //     sender.privateKey.bytes,
        //     false
        // );
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
        console.log(isVerifiedA);
        const txB = Transaction.of({
            chainTag: networkInfo.solo.chainTag,
            blockRef: latestBlock?.id.slice(0, 18) ?? '0x0',
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
        console.log(isVerifiedB);
        const isVerifiedForge = nc_secp256k1.verify(
            sigmaA,
            hashB,
            gasPayerPublicKey
        );
        console.log(isVerifiedForge);
    });
});
