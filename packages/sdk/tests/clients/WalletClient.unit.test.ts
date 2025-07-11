import * as nc_utils from '@noble/curves/abstract/utils';
import type { RegularBlockResponseJSON } from '@thor/blocks/json';
import {
    ClauseBuilder,
    ThorNetworks,
    Transaction,
    type TransactionBody
} from '@thor';
import { Address, Blake2b256, HexUInt, VET } from '@vcdm';
import { SOLO_NETWORK } from '@utils';
import { TEST_ACCOUNTS } from '../fixture';
import { Secp256k1 } from '@secp256k1';
import { WalletClient } from '@clients/WalletClient';
import { privateKeyToAccount } from 'viem/accounts';

const { TRANSACTION_SENDER, TRANSACTION_RECEIVER } = TEST_ACCOUNTS.TRANSACTION;

/**
 * @group unit/clients
 */
describe('WalletClient UNIT tests', () => {
    describe('signTransaction', () => {
        test('a', () => {
            const sender = TRANSACTION_SENDER;
            const receiver = TRANSACTION_RECEIVER;
            console.log(sender.address, sender.privateKey);
            console.log(receiver.address, receiver.privateKey);
        });

        test('x', async () => {
            const latestBlock = {
                number: 88,
                id: '0x00000058f9f240032e073f4a078c5f0f3e04ae7272e4550de41f10723d6f8b2e',
                size: 364,
                parentID:
                    '0x000000577127e6426fbe5a303755ba64c167f173bb4e9b60156a62bced1551d8',
                timestamp: 1749224420,
                gasLimit: '150000000',
                beneficiary: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                gasUsed: '0',
                totalScore: 88,
                txsRoot:
                    '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                txsFeatures: 1,
                stateRoot:
                    '0xe030c534b66bd1c1b156ada9508bd639cdcbeb7ea1e932f4fd998857b3c4f30a',
                receiptsRoot:
                    '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                com: false,
                signer: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                isTrunk: true,
                isFinalized: false,
                baseFeePerGas: '0x9184e72a000',
                transactions: []
            } satisfies RegularBlockResponseJSON;
            const transferClause = ClauseBuilder.transferVET(
                Address.of(TRANSACTION_RECEIVER.address),
                VET.of(1)
            );
            const txBody: TransactionBody = {
                chainTag: SOLO_NETWORK.chainTag,
                blockRef: latestBlock.id.toString().slice(0, 18),
                expiration: 32,
                clauses: [transferClause],
                gasPriceCoef: 0,
                gas: 100000,
                dependsOn: null,
                nonce: 8
            };
            const signedTx = Transaction.of(txBody).sign(
                HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
            );
            const encodedSignedTx = signedTx.encoded;
            // console.log(HexUInt.of(encodedSignedTx).toString());

            const encoded = Transaction.of(txBody).encoded;
            // console.log(HexUInt.of(encoded).toString());
            const pk = HexUInt.of(TRANSACTION_SENDER.privateKey).bytes;
            const txHash = Blake2b256.of(encoded).bytes;
            // console.log(HexUInt.of(txHash).toString());
            const s0 = Secp256k1.sign(txHash, pk);
            console.log(HexUInt.of(s0).toString());
            const s1 = Transaction.of(txBody).sign(pk).signature;
            console.log(HexUInt.of(s1 ?? 0).toString());

            const account = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const s2 = HexUInt.of(
                await account.sign({
                    hash: `0x${HexUInt.of(txHash).digits}`
                })
            ).bytes;
            console.log(HexUInt.of(s2).toString());
            console.log(s2.length);
            const r = nc_utils.bytesToNumberBE(s2.slice(0, 32));
            const s = nc_utils.bytesToNumberBE(s2.slice(32, 64));
            const v = nc_utils.bytesToNumberBE(s2.slice(64, 65)) - 27n;
            const s3 = nc_utils.concatBytes(
                nc_utils.numberToBytesBE(r, 32),
                nc_utils.numberToBytesBE(s, 32),
                nc_utils.numberToVarBytesBE(v)
            );
            console.log(HexUInt.of(s3).toString());
        });

        test('equality <- vechain viem', async () => {
            const latestBlock = {
                number: 88,
                id: '0x00000058f9f240032e073f4a078c5f0f3e04ae7272e4550de41f10723d6f8b2e',
                size: 364,
                parentID:
                    '0x000000577127e6426fbe5a303755ba64c167f173bb4e9b60156a62bced1551d8',
                timestamp: 1749224420,
                gasLimit: '150000000',
                beneficiary: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                gasUsed: '0',
                totalScore: 88,
                txsRoot:
                    '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                txsFeatures: 1,
                stateRoot:
                    '0xe030c534b66bd1c1b156ada9508bd639cdcbeb7ea1e932f4fd998857b3c4f30a',
                receiptsRoot:
                    '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                com: false,
                signer: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                isTrunk: true,
                isFinalized: false,
                baseFeePerGas: '0x9184e72a000',
                transactions: []
            } satisfies RegularBlockResponseJSON;
            const transferClause = ClauseBuilder.transferVET(
                Address.of(TRANSACTION_RECEIVER.address),
                VET.of(1)
            );
            const txBody: TransactionBody = {
                chainTag: SOLO_NETWORK.chainTag,
                blockRef: latestBlock.id.toString().slice(0, 18),
                expiration: 32,
                clauses: [transferClause],
                gasPriceCoef: 0,
                gas: 100000,
                dependsOn: null,
                nonce: 8
            };
            const signedVeChain = Transaction.of(txBody).sign(
                HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
            );
            const encodedSignedTx = signedVeChain.encoded;
            console.log(HexUInt.of(encodedSignedTx).toString());

            const account = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const walletClient = new WalletClient(
                ThorNetworks.SOLONET,
                account
            );
            const tx = Transaction.of(txBody);
            const signedViem = await walletClient.signTransaction(tx);
            console.log(signedViem.toString());
        });
    });
});
