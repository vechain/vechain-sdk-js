import { describe, expect, test } from '@jest/globals';
import { addressUtils, secp256k1 } from '@vechain/vechain-sdk-core';
import { BaseWallet } from '../../src/wallets/base-wallet/base-wallet';
import { type WalletAccount } from '../../src';

/**
 * Unit test for BaseWallet class.
 *
 * @group unit/wallet/base-wallet
 */
describe('Base wallet tests', () => {
    /**
     * Test without blocking execution on steps
     */
    test('Should be able to create a wallet and get addresses from them', async () => {
        // Generate 10 random accounts
        const accounts: WalletAccount[] = Array.from({ length: 10 }, () => {
            const privateKey = secp256k1.generatePrivateKey();
            const publicKey = secp256k1.derivePublicKey(privateKey);
            const address = addressUtils.fromPublicKey(publicKey);

            return {
                privateKey,
                publicKey,
                address
            } satisfies WalletAccount;
        });

        // Initialize a wallet with the accounts
        const baseWallet = new BaseWallet(accounts);

        // Get the addresses from the wallet
        expect(baseWallet.accounts).toEqual(accounts);

        // Get the addresses from the wallet
        const addresses = await baseWallet.getAddresses();
        expect(addresses).toEqual(accounts.map((account) => account.address));
    });
});
