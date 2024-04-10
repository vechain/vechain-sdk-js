// Generate 10 random accounts
import type { WalletAccount } from '../../src';
import { addressUtils, secp256k1 } from '@vechain/sdk-core';

/**
 * Fixture of WalletAccount randomly generated.
 */
const accountsFixture: WalletAccount[] = Array.from({ length: 10 }, () => {
    const privateKey = Buffer.from(secp256k1.generatePrivateKey());
    const publicKey = Buffer.from(secp256k1.derivePublicKey(privateKey));
    const address = addressUtils.fromPublicKey(publicKey);

    return {
        privateKey,
        publicKey,
        address
    } satisfies WalletAccount;
});

export { accountsFixture };
