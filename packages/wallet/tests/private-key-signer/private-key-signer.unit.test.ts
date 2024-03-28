import { describe, expect, test } from '@jest/globals';
import { mnemonic } from '@vechain/sdk-core';
import { HttpClient, ThorClient } from '@vechain/sdk-network';
import { PrivateKeySigner } from '../../src/signers/private-key-signer/private-key-signer';

/**
 * Unit test for Signer class.
 *
 * @group unit/signer
 */
describe('Signer Tests', () => {
    // ThorClient instance
    const testNetwork = new HttpClient('https://testnet.vechain.org/');
    const thorClient = new ThorClient(testNetwork);

    const privateKey = mnemonic.derivePrivateKey([
        'dumb',
        'labor',
        'shop',
        'more',
        'table',
        'wrap',
        'media',
        'expand',
        'bulb',
        'salmon',
        'term',
        'body'
    ]);

    const pkSigner = new PrivateKeySigner(thorClient, privateKey);

    test('should be able to send a transaction', async () => {
        // Send a transaction
        const response = await pkSigner.sendTransaction([
            {
                to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
                value: 100,
                data: '0x'
            }
        ]);

        expect(response.id).toBeDefined();
    });

    test('2', async () => {
        const privateKey = Buffer.from(
            '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
            'hex'
        );
        // const publicKey = secp256k1.derivePublicKey(privateKey);
        // const userAddress = addressUtils.fromPublicKey(publicKey);

        const pkSigner = new PrivateKeySigner(thorClient, privateKey);

        // Send a transaction
        const response = await pkSigner.sendTransaction([
            {
                to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
                value: 100,
                data: '0x'
            }
        ]);

        expect(response.id).toBeDefined();
    });
});
