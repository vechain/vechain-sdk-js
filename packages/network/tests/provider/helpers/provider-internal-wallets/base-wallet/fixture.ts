// Generate 10 random accounts
import { Address, Secp256k1 } from '@vechain/sdk-core';
import { type ProviderInternalWalletAccount } from '../../../../../src';
import { secp256k1 as nc_secp256k1 } from '@noble/curves/secp256k1';

/**
 * Fixture of ProviderInternalWalletAccount randomly generated.
 */
const accountsFixture: ProviderInternalWalletAccount[] = Array.from(
    { length: 10 },
    () => {
        const privateKey = Buffer.from(nc_secp256k1.utils.randomPrivateKey());
        const publicKey = Buffer.from(Secp256k1.derivePublicKey(privateKey));
        const address = Address.ofPublicKey(publicKey).toString();

        return {
            privateKey,
            publicKey,
            address
        } satisfies ProviderInternalWalletAccount;
    }
);

export { accountsFixture };
