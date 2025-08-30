/**
 * Test file to verify key management functionality
 * This demonstrates how to use existing SDK features for secure key management
 */

import { describe, expect, test, beforeEach } from '@jest/globals';
import { Address, HDKey, HexUInt, Mnemonic, Secp256k1 } from '@common';
import { Transaction } from '@thor';

class KeyManager {
    private readonly hdNode: HDKey;

    constructor(mnemonicWords?: string[]) {
        if (mnemonicWords != null) {
            this.hdNode = HDKey.fromMnemonic(mnemonicWords);
        } else {
            // Generate new mnemonic
            const mnemonicWords = Mnemonic.of();
            this.hdNode = HDKey.fromMnemonic(mnemonicWords);
        }
    }

    // Create account from HD wallet
    createAccount(index: number = 0): {
        privateKey: Uint8Array;
        address: string;
        clear: () => void;
    } {
        const child = this.hdNode.deriveChild(index);
        const privateKey = child.privateKey as Uint8Array;
        const address = Address.ofPublicKey(child.publicKey as Uint8Array);

        return {
            privateKey,
            address: address.toString(),
            // Method to clear memory
            clear: () => privateKey.fill(0)
        };
    }

    // Recover account from mnemonic - more secure than keystore
    getAccountFromMnemonic(
        mnemonicWords: string[],
        index: number = 0
    ): {
        privateKey: Uint8Array;
        address: string;
    } {
        const hdNode = HDKey.fromMnemonic(mnemonicWords);
        const child = hdNode.deriveChild(index);

        return {
            privateKey: child.privateKey as Uint8Array,
            address: Address.ofPublicKey(
                child.publicKey as Uint8Array
            ).toString()
        };
    }

    // Validate private key using SDK
    validatePrivateKey(privateKey: Uint8Array): boolean {
        return Secp256k1.isValidPrivateKey(privateKey);
    }

    // Method to sign transactions
    signTransaction(
        transaction: Transaction,
        privateKey: Uint8Array
    ): Transaction {
        if (!this.validatePrivateKey(privateKey)) {
            throw new Error('Invalid private key');
        }

        // Create a copy of the private key to avoid modifying the original
        const privateKeyCopy = new Uint8Array(privateKey);
        const signedTx = transaction.sign(privateKeyCopy);

        // Clear memory of the copy
        privateKeyCopy.fill(0);

        return signedTx;
    }
}

describe('Key Management Tests', () => {
    let keyManager: KeyManager;
    let testMnemonic: string[];

    beforeEach(() => {
        // Generate a test mnemonic
        testMnemonic = Mnemonic.of();
        keyManager = new KeyManager(testMnemonic);
    });

    describe('Account Creation', () => {
        test('should create account with valid private key and address', () => {
            const account = keyManager.createAccount(0);

            expect(account.privateKey).toBeDefined();
            expect(account.privateKey.length).toBe(32);
            expect(account.address).toBeDefined();
            expect(account.address).toMatch(/^0x[a-fA-F0-9]{40}$/);

            // Verify private key is valid
            expect(keyManager.validatePrivateKey(account.privateKey)).toBe(
                true
            );

            // Verify address derivation
            const derivedAddress = Address.ofPublicKey(
                Secp256k1.derivePublicKey(account.privateKey)
            ).toString();
            expect(account.address).toBe(derivedAddress);

            // Clean up
            account.clear();
        });

        test('should create multiple accounts with different indices', () => {
            const account1 = keyManager.createAccount(0);
            const account2 = keyManager.createAccount(1);

            expect(account1.address).not.toBe(account2.address);
            expect(account1.privateKey).not.toEqual(account2.privateKey);

            // Clean up
            account1.clear();
            account2.clear();
        });
    });

    describe('Mnemonic Recovery', () => {
        test('should recover account from mnemonic', () => {
            const originalAccount = keyManager.createAccount(0);
            const recoveredAccount = keyManager.getAccountFromMnemonic(
                testMnemonic,
                0
            );

            expect(recoveredAccount.address).toBe(originalAccount.address);
            expect(recoveredAccount.privateKey).toEqual(
                originalAccount.privateKey
            );

            // Clean up
            originalAccount.clear();
        });

        test('should recover different accounts with different indices', () => {
            const account0 = keyManager.getAccountFromMnemonic(testMnemonic, 0);
            const account1 = keyManager.getAccountFromMnemonic(testMnemonic, 1);

            expect(account0.address).not.toBe(account1.address);
            expect(account0.privateKey).not.toEqual(account1.privateKey);
        });
    });

    describe('Private Key Validation', () => {
        test('should validate correct private key', async () => {
            const privateKey = await Secp256k1.generatePrivateKey();
            expect(keyManager.validatePrivateKey(privateKey)).toBe(true);
        });

        test('should reject invalid private key', () => {
            const invalidKey = new Uint8Array(32).fill(0);
            expect(keyManager.validatePrivateKey(invalidKey)).toBe(false);
        });

        test('should reject wrong length private key', () => {
            const wrongLengthKey = new Uint8Array(16);
            expect(keyManager.validatePrivateKey(wrongLengthKey)).toBe(false);
        });
    });

    describe('Transaction Signing', () => {
        test('should sign transaction correctly', () => {
            const account = keyManager.createAccount(0);

            // Create a simple transaction
            const transaction = Transaction.of({
                chainTag: 1,
                blockRef: '0x0000000000000000',
                expiration: 32,
                clauses: [],
                gasPriceCoef: 0,
                gas: 100000,
                dependsOn: null,
                nonce: 1
            });

            const signedTx = keyManager.signTransaction(
                transaction,
                account.privateKey
            );

            expect(signedTx.signature).toBeDefined();
            if (signedTx.signature != null) {
                expect(signedTx.signature.length).toBeGreaterThan(0);
            }

            // Verify the signature is valid
            expect(signedTx.isSigned).toBe(true);
        });

        test('should reject invalid private key for signing', () => {
            const transaction = Transaction.of({
                chainTag: 1,
                blockRef: '0x0000000000000000',
                expiration: 32,
                clauses: [],
                gasPriceCoef: 0,
                gas: 100000,
                dependsOn: null,
                nonce: 1
            });

            const invalidKey = new Uint8Array(32).fill(0);

            expect(() => {
                keyManager.signTransaction(transaction, invalidKey);
            }).toThrow('Invalid private key');
        });
    });

    describe('Memory Management', () => {
        test('should clear private key from memory', () => {
            const account = keyManager.createAccount(0);
            const originalKey = new Uint8Array(account.privateKey);

            account.clear();

            // Verify the key has been cleared
            expect(account.privateKey.every((byte: number) => byte === 0)).toBe(
                true
            );
            // Note: originalKey is a copy, so it won't be cleared
            expect(originalKey.some((byte) => byte !== 0)).toBe(true);
        });
    });

    describe('Direct SDK Usage (Alternative to Keystore)', () => {
        test('should generate and use private key directly', async () => {
            // Generate private key directly
            const privateKey = await Secp256k1.generatePrivateKey();

            // Derive public key
            const publicKey = Secp256k1.derivePublicKey(privateKey);

            // Create address
            const address = Address.ofPublicKey(publicKey);

            // Verify everything works
            expect(Secp256k1.isValidPrivateKey(privateKey)).toBe(true);
            expect(publicKey.length).toBe(33); // compressed
            expect(address.toString()).toMatch(/^0x[a-fA-F0-9]{40}$/);

            // Clean up
            privateKey.fill(0);
        });

        test('should work with hex string private keys', () => {
            const hexPrivateKey =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            const privateKey = HexUInt.of(hexPrivateKey).bytes;

            expect(keyManager.validatePrivateKey(privateKey)).toBe(true);

            const publicKey = Secp256k1.derivePublicKey(privateKey);
            const address = Address.ofPublicKey(publicKey);

            expect(address.toString()).toBeDefined();
        });
    });

    describe('HD Wallet Functionality', () => {
        test('should derive multiple accounts from same mnemonic', () => {
            const accounts = [];

            for (let i = 0; i < 5; i++) {
                accounts.push(keyManager.createAccount(i));
            }

            // All addresses should be different
            const addresses = accounts.map((acc) => acc.address);
            const uniqueAddresses = new Set(addresses);
            expect(uniqueAddresses.size).toBe(5);

            // Clean up
            accounts.forEach((acc) => {
                acc.clear();
            });
        });

        test('should use standard VET derivation path', () => {
            const hdNode = HDKey.fromMnemonic(testMnemonic);
            const vetPath = HDKey.VET_DERIVATION_PATH; // m/44'/818'/0'/0

            const child = hdNode.derive(vetPath);
            const address = Address.ofPublicKey(child.publicKey as Uint8Array);

            expect(address.toString()).toMatch(/^0x[a-fA-F0-9]{40}$/);
        });
    });
});
