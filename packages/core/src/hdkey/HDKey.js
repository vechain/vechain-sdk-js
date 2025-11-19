"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HDKey = void 0;
const s_bip32 = __importStar(require("@scure/bip32"));
const s_bip39 = __importStar(require("@scure/bip39"));
const nc_utils = __importStar(require("@noble/curves/abstract/utils"));
const base_1 = require("@scure/base");
const FixedPointNumber_1 = require("../vcdm/FixedPointNumber");
const Sha256_1 = require("../vcdm/hash/Sha256");
const HexUInt_1 = require("../vcdm/HexUInt");
const Secp256k1_1 = require("../secp256k1/Secp256k1");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * This class extends the
 * [BIP32 Hierarchical Deterministic Key](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
 * [HDKey](https://github.com/paulmillr/scure-bip32) class
 * to provide interoperability with
 * [ethers.js 6 HDNodeWallet](https://docs.ethers.org/v6/api/wallet/#HDNodeWallet).
 *
 * @extends s_bip32.HDKey
 */
class HDKey extends s_bip32.HDKey {
    /**
     * Prefix for extended private key
     */
    static EXTENDED_PRIVATE_KEY_PREFIX = HexUInt_1.HexUInt.of('0488ade4000000000000000000').bytes;
    /**
     * Prefix for extended public key
     */
    static EXTENDED_PUBLIC_KEY_PREFIX = HexUInt_1.HexUInt.of('0488b21e000000000000000000').bytes;
    /**
     * Default VET derivation path.
     *
     * See
     * [SLIP-0044 : Registered coin types for BIP-0044](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)
     * for more info.
     */
    static VET_DERIVATION_PATH = "m/44'/818'/0'/0";
    /**
     * Creates a
     * [BIP32 Hierarchical Deterministic Key](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
     * from
     * [BIP39 Mnemonic Words](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
     * and the given derivation path.
     *
     * @param {string[]} words - An array of words representing the mnemonic.
     * @param {string} path - The derivation path to derive the child node.
     * Default value is {@link VET_DERIVATION_PATH}.
     *
     * @return The derived child hierarchical deterministic key.
     *
     * @throws {InvalidHDKey} If `path` is not valid to derive a node wallet.
     * @throws {InvalidHDKeyMnemonic} If `words` is an invalid array mnemonic.
     *
     * @remarks Security auditable method, depends on
     * * [s_bip32.HDKey.derive](https://github.com/paulmillr/scure-bip32);
     * * [s_bip32.HDKey.fromMasterSeed](https://github.com/paulmillr/scure-bip32);
     * * [s_bip39.mnemonicToSeedSync](https://github.com/paulmillr/scure-bip39).
     */
    static fromMnemonic(words, path = this.VET_DERIVATION_PATH) {
        let master;
        try {
            master = s_bip32.HDKey.fromMasterSeed(s_bip39.mnemonicToSeedSync(words.join(' ').toLowerCase()));
        }
        catch (error) {
            // The error masks any mnemonic words leak.
            throw new sdk_errors_1.InvalidHDKeyMnemonic('HDNode.fromMnemonic', 'Invalid mnemonic words given as input.', undefined, error);
        }
        try {
            return master.derive(path);
        }
        catch (error) {
            throw new sdk_errors_1.InvalidHDKey('HDNode.fromMnemonic', 'Invalid derivation path given as input.', { derivationPath: path }, error);
        }
    }
    /**
     * Creates a
     * [BIP32 Hierarchical Deterministic Key](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
     * from a private key and chain code.
     *
     * @param {Uint8Array} - privateKey The private key.
     * @param {Uint8Array} - chainCode The chain code.
     *
     * @returns Returns the hierarchical deterministic key from `privateKey` and `chainCode`.
     *
     * @throws {InvalidSecp256k1PrivateKey} If the `privateKey` is invalid.
     *
     * @remarks **This method wipes `privateKey`** for security reasons.
     * @remarks Security auditable method, depends on
     * * [base58.encode](https://github.com/paulmillr/scure-base);
     * * {@link Sha256};
     * * [s_bip32.HDKey.fromExtendedKey](https://github.com/paulmillr/scure-bip32).
     */
    static fromPrivateKey(privateKey, chainCode) {
        if (privateKey.length === 32) {
            const header = nc_utils.concatBytes(this.EXTENDED_PRIVATE_KEY_PREFIX, chainCode, Uint8Array.of(0), privateKey);
            privateKey.fill(0); // Clear the private key from memory.
            const checksum = Sha256_1.Sha256.of(Sha256_1.Sha256.of(header).bytes).bytes.subarray(0, 4);
            const expandedPrivateKey = nc_utils.concatBytes(header, checksum);
            try {
                return s_bip32.HDKey.fromExtendedKey(base_1.base58.encode(expandedPrivateKey));
            }
            catch {
                throw new sdk_errors_1.InvalidSecp256k1PrivateKey('HDNode.fromPrivateKey', 'Invalid private key path given as input.', undefined);
            }
        }
        // We reach this case if privateKey length is not exactly 32 bytes.
        privateKey.fill(0); // Clear the private key from memory, albeit it is invalid.
        throw new sdk_errors_1.InvalidSecp256k1PrivateKey('HDNode.fromPrivateKey()', 'Invalid private key path given as input. Length must be exactly 32 bytes.', undefined);
    }
    /**
     * Creates a
     * [BIP32 Hierarchical Deterministic Key](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
     * key from a public key and chain code.
     *
     * @param {Uint8Array} publicKey - The public key bytes.
     * @param {Uint8Array} chainCode - The chain code bytes.
     *
     * @returns {HDKey} Returns the hierarchical deterministic key from `public` and `chainCode`.
     *
     * @throws {InvalidHDKey} if the `publicKey` is invalid.
     *
     * @remarks Security auditable method, depends on
     * * [base58.encode](https://github.com/paulmillr/scure-base);
     * * {@link Secp256k1.compressPublicKey};
     * * {@link Sha256};
     * * [HDKey.fromExtendedKey](https://github.com/paulmillr/scure-bip32).
     */
    static fromPublicKey(publicKey, chainCode) {
        if (chainCode.length === 32) {
            const header = nc_utils.concatBytes(this.EXTENDED_PUBLIC_KEY_PREFIX, chainCode, Secp256k1_1.Secp256k1.compressPublicKey(publicKey));
            const checksum = Sha256_1.Sha256.of(Sha256_1.Sha256.of(header).bytes).bytes.subarray(0, 4);
            const expandedPublicKey = nc_utils.concatBytes(header, checksum);
            try {
                return s_bip32.HDKey.fromExtendedKey(base_1.base58.encode(expandedPublicKey));
            }
            catch (error) {
                throw new sdk_errors_1.InvalidHDKey('HDNode.fromPublicKey()', 'Invalid public key path given as input.', { publicKey }, error);
            }
        }
        // We reach this case if chainCode length is not exactly 32 bytes.
        throw new sdk_errors_1.InvalidHDKey('HDNode.fromPublicKey()', 'Invalid chain code given as input. Length must be exactly 32 bytes.', { chainCode });
    }
    /**
     * Checks if derivation path single component is valid
     *
     * @param component - Derivation path single component to check
     * @param index - Derivation path single component index
     *
     * @returns `true`` if derivation path single component is valid, otherwise `false`.
     *
     */
    static isDerivationPathComponentValid(component, index) {
        // Zero component can be "m" or "number" or "number'", other components can be only "number" or "number'"
        return (
        // m
        (index === 0 ? component === 'm' : false) ||
            // "number"
            FixedPointNumber_1.FixedPointNumber.isNaturalExpression(component) ||
            // "number'"
            (FixedPointNumber_1.FixedPointNumber.isNaturalExpression(component.slice(0, -1)) &&
                component.endsWith("'")));
    }
    /**
     * Checks if BIP32 derivation path is valid.
     *
     * @param derivationPath - Derivation path to check.
     *
     * @returns `true` if derivation path is valid, otherwise `false`.
     */
    static isDerivationPathValid(derivationPath) {
        const bip32Regex = /^m(\/\d+'?){3}(\/\d+){1,2}$/;
        return bip32Regex.test(derivationPath);
    }
}
exports.HDKey = HDKey;
