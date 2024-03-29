import { describe, expect, test } from '@jest/globals';
import { mnemonic } from '@vechain/sdk-core';
import { HttpClient, ThorClient } from '@vechain/sdk-network';
import { PrivateKeySigner } from '../../src';

/**
 * Unit test for PrivateKeySigner class.
 *
 * @group unit/signer/private-key-signer
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

    test('Should be able to send a transaction given the mnemonic', async () => {
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

    test('Should be able to send a transaction given a private key', async () => {
        const privateKey = Buffer.from(
            '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
            'hex'
        );

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

    test('Should throw error when insufficient gas', async () => {
        const privateKey = Buffer.from(
            '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
            'hex'
        );

        const pkSigner = new PrivateKeySigner(thorClient, privateKey);

        // The transaction is expected to fail because of insufficient gas
        await expect(
            pkSigner.sendTransaction(
                [
                    {
                        to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
                        value: 100,
                        data: '0x'
                    }
                ],
                { gas: 100 }
            )
        ).rejects.toThrowError('Insufficient gas');
    });
});
