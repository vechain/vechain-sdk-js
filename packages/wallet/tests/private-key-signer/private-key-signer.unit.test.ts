import { describe, expect, test } from '@jest/globals';
import { mnemonic } from '@vechain/sdk-core';
import { HttpClient, ThorClient } from '@vechain/sdk-network';
import { PrivateKeySigner } from '../../src/signers/private-key-signer';

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
});
