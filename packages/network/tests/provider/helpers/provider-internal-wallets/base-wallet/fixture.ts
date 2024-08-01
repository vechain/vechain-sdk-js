// Generate 10 random accounts
import { addressUtils, secp256k1 } from '@vechain/sdk-core';
import { type ProviderInternalWalletAccount } from '../../../../../src';
import { secp256k1 as n_secp256k1 } from '@noble/curves/secp256k1';

/**
 * Fixture of ProviderInternalWalletAccount randomly generated.
 */
const accountsFixture: ProviderInternalWalletAccount[] = Array.from(
    { length: 10 },
    () => {
        const privateKey = Buffer.from(n_secp256k1.utils.randomPrivateKey());
        const publicKey = Buffer.from(secp256k1.derivePublicKey(privateKey));
        const address = addressUtils.fromPublicKey(publicKey);

        return {
            privateKey,
            publicKey,
            address
        } satisfies ProviderInternalWalletAccount;
    }
);

export { accountsFixture };
