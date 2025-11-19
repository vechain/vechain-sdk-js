import { Address, Hex, Revision } from '@common/vcdm';
import { describe, expect, test } from '@jest/globals';
import { PrivateKeySigner } from '@thor/signer';
import { ThorClient } from '@thor/thor-client';
import { ClauseBuilder } from '@thor/thor-client/transactions/ClauseBuilder';
import { TransactionBuilder } from '@thor/thor-client/transactions/TransactionBuilder';
import { VTHO_ADDRESS } from '@thor/utils';
import { ThorNetworks } from '@thor/utils/const/network';
import { getConfigData } from '@vechain/sdk-solo-setup';

const soloConfig = getConfigData();
const thorClient = ThorClient.at(ThorNetworks.SOLONET);

/**
 * @group solo
 */
describe('ClauseBuilder transferVTHO SOLO tests', () => {
    test(
        'builds clause to VTHO contract and sends transfer on solo network',
        async () => {
            const sender = Address.of(
                soloConfig.DEFAULT_SOLO_ACCOUNT_ADDRESSES[0]
            );
            const senderPrivateKey = Hex.of(
                soloConfig.DEFAULT_SOLO_ACCOUNT_PRIVATE_KEYS[0]
            );
            const senderSigner = new PrivateKeySigner(senderPrivateKey.bytes);
            const receiver = Address.of(
                soloConfig.DEFAULT_SOLO_ACCOUNT_ADDRESSES[1]
            );

            const clause = ClauseBuilder.transferVTHO(receiver, 1n);

            expect(clause.to?.toString()).toEqual(
                Address.of(VTHO_ADDRESS).toString()
            );
            expect(clause.value).toBe(0n);
            expect(clause.data).not.toBeNull();

            const txRequest = await TransactionBuilder.create(thorClient)
                .withClauses([clause])
                .withDynFeeTxDefaults()
                .withEstimatedGas(sender, {
                    revision: Revision.BEST
                })
                .build();

            const signedTxRequest = senderSigner.sign(txRequest);
            const txId =
                await thorClient.transactions.sendTransaction(
                    signedTxRequest
                );

            expect(txId).toBeDefined();

            const receipt =
                await thorClient.transactions.waitForTransactionReceipt(txId);

            expect(receipt).not.toBeNull();
            expect(receipt?.reverted).toBe(false);
        },
        30000
    );
});


