import { Secp256k1 } from '@common/cryptography';
import { VIP191Error } from '@common/errors';
import { Address, Revision } from '@common/vcdm';
import { describe, expect, test } from '@jest/globals';
import { VIP191Client } from '@thor/gas-payers';
import {
    ClauseBuilder,
    ThorClient,
    TransactionBuilder
} from '@thor/thor-client';
import { ThorNetworks } from '@thor/utils';

// solo mnemonic account addresses
const senderAddress = Address.of('0xf077b491b355e64048ce21e3a6fc4751eeea77fa');
const receiverAddress = Address.of(
    '0x435933c8064b4ae76be665428e0307ef2ccfbd68'
);

/**
 * @group testnet
 */
describe('VIP191Client Testnet Tests', () => {
    test('ok <- legacy sponsored VET transfer transaction', async () => {
        const thorClient = ThorClient.at(ThorNetworks.TESTNET);
        // create tx request with a VET transfer clause
        const clause = ClauseBuilder.transferVET(receiverAddress, 1n);
        const txRequest = await TransactionBuilder.create(thorClient)
            .withClauses([clause])
            .withEstimatedGas(senderAddress, { revision: Revision.BEST })
            .withLegacyTxDefaults()
            .withDelegatedFee()
            .build();
        // request signature from vechain energy
        const vip191Client = VIP191Client.of(
            'https://sponsor-testnet.vechain.energy/by/883'
        );
        const signature = await vip191Client.requestSignature(
            senderAddress,
            txRequest
        );
        expect(signature).toBeDefined();
        expect(signature.bytes.length).toBe(Secp256k1.SIGNATURE_LENGTH);
    });
    test('ok <- dynamic fee sponsored VET transfer transaction', async () => {
        const thorClient = ThorClient.at(ThorNetworks.TESTNET);
        // create tx request with a VET transfer clause
        const clause = ClauseBuilder.transferVET(receiverAddress, 1n);
        const txRequest = await TransactionBuilder.create(thorClient)
            .withClauses([clause])
            .withEstimatedGas(senderAddress, { revision: Revision.BEST })
            .withDynFeeTxDefaults()
            .withDelegatedFee()
            .build();
        // request signature from vechain energy
        const vip191Client = VIP191Client.of(
            'https://sponsor-testnet.vechain.energy/by/883'
        );
        const signature = await vip191Client.requestSignature(
            senderAddress,
            txRequest
        );
        expect(signature).toBeDefined();
        expect(signature.bytes.length).toBe(Secp256k1.SIGNATURE_LENGTH);
    });
    test('err <- vechain energy error if chaintag is not for testnet', async () => {
        // vechain energy account is only for testnet
        const thorClient = ThorClient.at(ThorNetworks.MAINNET);
        // create tx request with a VET transfer clause
        const clause = ClauseBuilder.transferVET(receiverAddress, 1n);
        const txRequest = await TransactionBuilder.create(thorClient)
            .withClauses([clause])
            .withEstimatedGas(senderAddress, {
                revision: Revision.BEST
            })
            .withDynFeeTxDefaults()
            .withDelegatedFee()
            .build();
        // request signature from vechain energy
        const vip191Client = VIP191Client.of(
            'https://sponsor-testnet.vechain.energy/by/883'
        );
        await expect(
            vip191Client.requestSignature(senderAddress, txRequest)
        ).rejects.toThrow(VIP191Error);
    });
});
