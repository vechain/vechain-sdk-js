import { describe, expect, test } from '@jest/globals';
import { HttpClient, ThorClient } from '@vechain/sdk-network';
import { Signer } from '../../src/signer/signer';
import { PrivateKeySigner } from '../../src/signer/private-key-signer';
import { mnemonic } from '@vechain/sdk-core';

/**
 * Unit test for Signer class.
 *
 * @group unit/signer
 */
describe('Signer Tests', () => {
    const testnetUrl = 'https://testnet.vechain.org';
    const testNetwork = new HttpClient(testnetUrl);
    const thorClient = new ThorClient(testNetwork);

    const walletId = 'walletId';
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
    const privateKeySigner = new PrivateKeySigner(thorClient, privateKey);

    test('Should be able to add a wallet and select it', () => {
        const signer = new Signer(thorClient);

        // Add a wallet
        signer.addWallet(walletId, privateKeySigner);

        // Select the wallet and expect no error
        expect(() => {
            signer.selectWallet(walletId);
        }).not.toThrowError();
    });

    test('Should throw an error if trying to select a wallet that does not exist', () => {
        const signer = new Signer(thorClient);

        // Select a non-existing wallet and expect an error
        expect(() => {
            signer.selectWallet(walletId);
        }).toThrowError(`Wallet with id ${walletId} not found`);
    });

    test('Should be able to remove a wallet', () => {
        const signer = new Signer(thorClient);

        // Add a wallet
        signer.addWallet(walletId, privateKeySigner);

        // Remove the wallet and expect no error
        expect(() => {
            signer.removeWallet(walletId);
        }).not.toThrowError();
    });

    test('Should throw an error if trying to remove a wallet that does not exist', () => {
        const signer = new Signer(thorClient);

        // Remove a non-existing wallet and expect an error
        expect(() => {
            signer.removeWallet(walletId);
        }).toThrowError(`Wallet with id ${walletId} not found`);
    });

    test('Should be able to send a transaction', async () => {
        const signer = new Signer(thorClient);
        const privateKeySigner = new PrivateKeySigner(thorClient, privateKey);

        // Add a wallet
        signer.addWallet(walletId, privateKeySigner);

        // Select the wallet
        signer.selectWallet(walletId);

        // Send a transaction
        const response = await signer.sendTransaction([
            {
                to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
                value: 100,
                data: '0x'
            }
        ]);

        expect(response.id).toBeDefined();
    });
});
