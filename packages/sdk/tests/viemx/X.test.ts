import { Address, HexUInt, HexUInt32, Revision, VET } from '@vcdm';
import {
    ClauseBuilder,
    RetrieveExpandedBlock,
    ThorNetworks,
    Transaction,
    type TransactionBody
} from '@thor';
import { type TransactionSerializedGeneric } from 'viem';
import { createWalletClient } from '../../src/viemx/WalletClient';
import { FetchHttpClient } from '@http';
import { SOLO_NETWORK } from '@utils';
import { expect, test } from '@jest/globals';
import { privateKeyToAccount } from 'viem/accounts';
import { secp256k1 as nc_secp256k1 } from '@noble/curves/secp256k1';
import * as nc_utils from '@noble/curves/abstract/utils';

describe('WalletClient SOLO tests', () => {
    describe('sendRawTransaction', () => {
        test('ok <- test', async () => {
            // BOILERPLATE

            const httpClient = FetchHttpClient.at(ThorNetworks.SOLONET);

            // TO BE FIXED: DYNAMIC ACCOUNT IS NOT SEEDED YET WHEN THIS TESTS RUNS IN SOLO
            const toAddress = Address.of(
                '0x435933c8064b4ae76be665428e0307ef2ccfbd68'
            ); // THIS SOLO DEFAULT ACCOUNT[1]

            // TO BE FIXED: DYNAMIC ACCOUNT IS NOT SEEDED YET WHEN THIS TESTS RUNS IN SOLO
            const privateKey =
                '99f0500549792796c14fed62011a51081dc5b5e68fe8bd8a13b86be829c4fd36'; // THIS SOLO DEFAULT ACCOUNT[1]

            const transferClause = ClauseBuilder.transferVET(
                Address.of(toAddress),
                VET.of(1)
            );

            const bestBlock = (
                await RetrieveExpandedBlock.of(Revision.BEST).askTo(httpClient)
            ).response;

            const transactionBody: TransactionBody = {
                chainTag: SOLO_NETWORK.chainTag,
                blockRef:
                    bestBlock !== null
                        ? bestBlock.id.toString().slice(0, 18)
                        : '0x0',
                expiration: 32,
                clauses: [transferClause],
                gasPriceCoef: 0,
                gas: 100000,
                dependsOn: null,
                nonce: 8
            };

            const signedTx = HexUInt.of(
                Transaction.of(transactionBody).sign(
                    HexUInt.of(privateKey).bytes
                ).encoded
            ).toString() as TransactionSerializedGeneric;

            const walletClient = createWalletClient({
                chain: ThorNetworks.SOLONET
            });
            const hash = await walletClient.sendRawTransaction(signedTx);
            console.log(hash.toString());
        });
    });

    test('x', async () => {
        const privateKey =
            '99f0500549792796c14fed62011a51081dc5b5e68fe8bd8a13b86be829c4fd36';
        const account = privateKeyToAccount(`0x${privateKey}`);
        const hash = HexUInt32.of('0xffffffff');
        const sig1 = await account.sign({
            hash: `0x${hash.digits}`
        });
        console.log(sig1);
        const sig = nc_secp256k1.sign(hash.bytes, HexUInt.of(privateKey).bytes);
        const sig2 = nc_utils.concatBytes(
            nc_utils.numberToBytesBE(sig.r, 32),
            nc_utils.numberToBytesBE(sig.s, 32),
            nc_utils.numberToVarBytesBE(27 + (sig.recovery % 2))
        );
        console.log(HexUInt.of(sig2).toString());
        expect(sig1).toEqual(HexUInt.of(sig2).toString());
    });
});
