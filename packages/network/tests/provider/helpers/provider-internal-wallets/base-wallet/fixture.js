"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountsFixture = void 0;
// Generate 10 random accounts
const sdk_core_1 = require("@vechain/sdk-core");
const secp256k1_1 = require("@noble/curves/secp256k1");
/**
 * Fixture of ProviderInternalWalletAccount randomly generated.
 */
const accountsFixture = Array.from({ length: 10 }, () => {
    const privateKey = secp256k1_1.secp256k1.utils.randomPrivateKey();
    const publicKey = sdk_core_1.Secp256k1.derivePublicKey(privateKey);
    const address = sdk_core_1.Address.ofPublicKey(publicKey).toString();
    return {
        privateKey,
        publicKey,
        address
    };
});
exports.accountsFixture = accountsFixture;
