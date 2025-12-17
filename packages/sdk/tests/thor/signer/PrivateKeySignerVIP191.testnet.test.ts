import { Secp256k1 } from '@common/cryptography';
import { Address, HexUInt, Revision } from '@common/vcdm';
import { describe, expect, test } from '@jest/globals';
import { PrivateKeySigner } from '@thor/signer';
import {
    ClauseBuilder,
    ThorClient,
    TransactionBuilder
} from '@thor/thor-client';
import { ThorNetworks } from '@thor/utils';

// solo mnemonic account addresses
// 1st solo account is the sender
const senderAddress = Address.of('0xf077b491b355e64048ce21e3a6fc4751eeea77fa');
// 2nd solo account is the receiver
const receiverAddress = Address.of(
    '0x435933c8064b4ae76be665428e0307ef2ccfbd68'
);
const senderPrivateKey =
    '0x99f0500549792796c14fed62011a51081dc5b5e68fe8bd8a13b86be829c4fd36';

/**
 * @group testnet
 */
describe('PrivateKeySigner VIP191 Testnet Tests', () => {
    test('ok <- will sign as gas payer using vechain energy', async () => {
        const thorClient = ThorClient.at(ThorNetworks.TESTNET);
        // create tx request with a VET transfer clause
        const clause = ClauseBuilder.transferVET(receiverAddress, 1n);
        const txRequest = await TransactionBuilder.create(thorClient)
            .withClauses([clause])
            .withEstimatedGas(senderAddress, { revision: Revision.BEST })
            .withDynFeeTxDefaults()
            .withDelegatedFee()
            .build();
        // create a vip191 compatible signer
        // this signer can be used to sign as sender and as vip191gas payer
        const signer = new PrivateKeySigner(
            HexUInt.of(senderPrivateKey).bytes,
            {
                vip191ServiceURL:
                    'https://sponsor-testnet.vechain.energy/by/883'
            }
        );
        // sign the transaction as sender
        const senderSignedTxRequest = await signer.sign(txRequest);
        // sign the transaction as vip191 gas payer
        const fullySignedTxRequest = await signer.sign(
            senderSignedTxRequest,
            senderAddress
        );
        // check the signature
        expect(fullySignedTxRequest.signature).toBeDefined();
        expect(fullySignedTxRequest.signature?.length).toBe(
            Secp256k1.SIGNATURE_LENGTH * 2
        );
        // check sender signature is preserved
        const fullySignedSenderSignature =
            fullySignedTxRequest.signature?.slice(
                0,
                Secp256k1.SIGNATURE_LENGTH
            );
        expect(fullySignedSenderSignature).toEqual(
            senderSignedTxRequest.signature
        );
        // check gas payer signature is present
        const fullySignedGasPayerSignature =
            fullySignedTxRequest.signature?.slice(
                Secp256k1.SIGNATURE_LENGTH,
                Secp256k1.SIGNATURE_LENGTH * 2
            );
        expect(fullySignedGasPayerSignature).toBeDefined();
        expect(fullySignedGasPayerSignature).not.toEqual(
            senderSignedTxRequest.signature
        );
    });
});
