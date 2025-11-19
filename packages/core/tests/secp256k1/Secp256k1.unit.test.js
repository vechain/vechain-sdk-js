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
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../src");
const n_utils = __importStar(require("@noble/curves/abstract/utils"));
const HASHES = {
    invalid: src_1.Txt.of('some_invalid_stuff').bytes,
    valid: src_1.Keccak256.of(src_1.Txt.of('hello world').bytes).bytes
};
const KEYS = {
    private: {
        invalid: n_utils.hexToBytes('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
        valid: n_utils.hexToBytes('7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a')
    },
    public: {
        compressed: n_utils.hexToBytes('03b90e9bb2617387eba4502c730de65a33878ef384a46f1096d86f2da19043304a'),
        uncompressed: n_utils.hexToBytes('04b90e9bb2617387eba4502c730de65a33878ef384a46f1096d86f2da19043304afa67d0ad09cf2bea0c6f2d1767a9e62a7a7ecc41facf18f2fa505d92243a658f')
    }
};
const SIGNATURES = {
    valid: n_utils.hexToBytes('f8fe82c74f9e1f5bf443f8a7f8eb968140f554968fdcab0a6ffe904e451c8b9244be44bccb1feb34dd20d9d8943f8c131227e55861736907b02d32c06b934d7200')
};
/**
 * Test Secp256k1 class.
 * @group unit/Secp256k1
 */
(0, globals_1.describe)('Secp256k1 class tests', () => {
    (0, globals_1.describe)('compressPublicKey', () => {
        (0, globals_1.test)('ok <- compressed', () => {
            (0, globals_1.expect)(src_1.Secp256k1.compressPublicKey(KEYS.public.compressed)).toStrictEqual(KEYS.public.compressed);
        });
        (0, globals_1.test)('ok <- uncompressed', () => {
            (0, globals_1.expect)(src_1.Secp256k1.compressPublicKey(KEYS.public.uncompressed)).toStrictEqual(KEYS.public.compressed);
        });
    });
    (0, globals_1.describe)('derivePublicKey', () => {
        (0, globals_1.test)('ok <- compressed', () => {
            (0, globals_1.expect)(src_1.Secp256k1.derivePublicKey(KEYS.private.valid)).toStrictEqual(src_1.Secp256k1.compressPublicKey(KEYS.public.compressed));
        });
        (0, globals_1.test)('ok <- uncompressed', () => {
            (0, globals_1.expect)(src_1.Secp256k1.derivePublicKey(KEYS.private.valid, false)).toStrictEqual(KEYS.public.uncompressed);
        });
        (0, globals_1.test)('error <- invalid key', () => {
            (0, globals_1.expect)(() => src_1.Secp256k1.derivePublicKey((0, src_1.ZERO_BYTES)(32))).toThrowError(sdk_errors_1.InvalidSecp256k1PrivateKey);
        });
    });
    (0, globals_1.describe)('generatePrivateKey', () => {
        (0, globals_1.test)('ok <- noble library', async () => {
            const privateKey = await src_1.Secp256k1.generatePrivateKey();
            // Length of private key should be 32 bytes
            (0, globals_1.expect)(privateKey.length).toBe(32);
            // Private key should be valid
            (0, globals_1.expect)(src_1.Secp256k1.isValidPrivateKey(privateKey)).toBe(true);
        });
        (0, globals_1.test)('error <- mock no hw support for cryptography', async () => {
            jest.spyOn(src_1.Secp256k1, 'generatePrivateKey').mockImplementation(() => {
                throw new sdk_errors_1.InvalidSecp256k1PrivateKey('Secp256k1.generatePrivateKey', 'Private key generation failed: ensure you have a secure random number generator available at runtime.', undefined);
            });
            await (0, globals_1.expect)(async () => await src_1.Secp256k1.generatePrivateKey()).rejects.toThrowError(sdk_errors_1.InvalidSecp256k1PrivateKey);
        });
    });
    (0, globals_1.describe)('inflatePublicKey', () => {
        (0, globals_1.test)('ok <- compressed', () => {
            (0, globals_1.expect)(src_1.Secp256k1.inflatePublicKey(KEYS.public.compressed)).toStrictEqual(KEYS.public.uncompressed);
        });
        (0, globals_1.test)('ok <- uncompressed', () => {
            (0, globals_1.expect)(src_1.Secp256k1.inflatePublicKey(KEYS.public.uncompressed)).toStrictEqual(KEYS.public.uncompressed);
        });
    });
    (0, globals_1.describe)('isValidMessageHash', () => {
        (0, globals_1.test)('true <- valid', () => {
            (0, globals_1.expect)(src_1.Secp256k1.isValidMessageHash(HASHES.valid)).toBe(true);
        });
        (0, globals_1.test)('false <- invalid', () => {
            (0, globals_1.expect)(src_1.Secp256k1.isValidMessageHash(HASHES.invalid)).toBe(false);
        });
    });
    (0, globals_1.describe)('isValidPrivateKey', () => {
        (0, globals_1.test)('true <- valid', () => {
            (0, globals_1.expect)(src_1.Secp256k1.isValidPrivateKey(KEYS.private.valid)).toBe(true);
        });
        (0, globals_1.test)('false <- invalid', () => {
            (0, globals_1.expect)(src_1.Secp256k1.isValidPrivateKey(KEYS.private.invalid)).toBe(false);
        });
    });
    (0, globals_1.describe)('sign', () => {
        (0, globals_1.test)('ok - valid hash', () => {
            (0, globals_1.expect)(src_1.Secp256k1.sign(HASHES.valid, KEYS.private.valid)).toStrictEqual(SIGNATURES.valid);
        });
        (0, globals_1.test)('error <- invalid hash', () => {
            (0, globals_1.expect)(() => src_1.Secp256k1.sign(HASHES.invalid, KEYS.private.valid)).toThrowError(sdk_errors_1.InvalidSecp256k1MessageHash);
        });
        (0, globals_1.test)('error <- invalid private key', () => {
            (0, globals_1.expect)(() => src_1.Secp256k1.sign(HASHES.valid, KEYS.private.invalid)).toThrowError(sdk_errors_1.InvalidSecp256k1PrivateKey);
        });
    });
    (0, globals_1.describe)('randomBytes', () => {
        (0, globals_1.test)('ok <- default', () => {
            const result = src_1.Secp256k1.randomBytes();
            (0, globals_1.expect)(result.length).toBe(32);
        });
        (0, globals_1.test)('ok <- set length', () => {
            const result = src_1.Secp256k1.randomBytes(16);
            (0, globals_1.expect)(result.length).toBe(16);
        });
    });
    (0, globals_1.describe)('recover', () => {
        (0, globals_1.test)('ok < - valid', () => {
            (0, globals_1.expect)(src_1.Secp256k1.recover(HASHES.valid, SIGNATURES.valid)).toStrictEqual(KEYS.public.uncompressed);
        });
        (0, globals_1.test)('error <- invalid hash', () => {
            (0, globals_1.expect)(() => src_1.Secp256k1.recover(HASHES.invalid, SIGNATURES.valid)).toThrowError(sdk_errors_1.InvalidSecp256k1MessageHash);
        });
        (0, globals_1.test)('error <- invalid signature', () => {
            // Forge an invalid signature...
            const invalidSignature = new Uint8Array(SIGNATURES.valid);
            // ... altering the last byte.
            invalidSignature[64] = 8;
            (0, globals_1.expect)(() => src_1.Secp256k1.recover(HASHES.valid, invalidSignature)).toThrowError(sdk_errors_1.InvalidSecp256k1Signature);
        });
    });
});
