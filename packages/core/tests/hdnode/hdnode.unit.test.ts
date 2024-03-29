import { describe, expect, test } from '@jest/globals';
import {
    HDNode,
    Hex,
    ZERO_BUFFER,
    addressUtils,
    mnemonic,
    secp256k1,
    type WordlistSizeType
} from '../../src';
import { addresses, words, wrongWords } from './fixture';
import {
    InvalidHDNodeChaincodeError,
    InvalidHDNodeDerivationPathError,
    InvalidHDNodeMnemonicsError,
    InvalidHDNodePrivateKeyError
} from '@vechain/sdk-errors';

/**
 * HDNode tests.
 * @group unit/hdnode
 */
describe('HDNode', () => {
    const master = HDNode.fromMnemonicx(words);

    test('HDNode - from mnemonic', () => {
        for (let i = 0; i < 5; i++) {
            const child = master.derive(i);
            // Correct address
            expect(
                Hex.canon(addressUtils.fromPublicKey(child.publicKey))
            ).toEqual(Hex.canon(addresses[i]));
            expect(Hex.canon(child.address)).toEqual(Hex.canon(addresses[i]));
            // Correct public key
            expect(
                Hex.of(
                    secp256k1.derivePublicKey(
                        child.privateKey ?? ZERO_BUFFER(0)
                    )
                )
            ).toEqual(Hex.of(child.publicKey));
        }
    });

    test('HDNode - from mnemonic - case insensitive check ', () => {
        const node = HDNode.fromMnemonic(words.map((w) => w.toUpperCase()));
        expect(node.address === master.address);
    });

    test('HDNode - from mnemonic - custom word list lengths', () => {
        // Default lengths
        new Array<WordlistSizeType>(12, 15, 18, 21, 24).forEach(
            (length: WordlistSizeType) => {
                const currentHdnode = HDNode.fromMnemonic(
                    mnemonic.generate(length)
                );
                // Private key
                expect(currentHdnode.privateKey).toBeDefined();
                expect(
                    secp256k1.isValidPrivateKey(
                        currentHdnode.privateKey as Buffer
                    )
                ).toBe(true);

                // Public key
                expect(currentHdnode.publicKey).toBeDefined();
                expect(
                    secp256k1.derivePublicKey(
                        currentHdnode.privateKey as Buffer
                    )
                ).toEqual(currentHdnode.publicKey);

                // Address
                expect(currentHdnode.address).toBeDefined();
                addressUtils.isAddress(currentHdnode.address);
            }
        );
    });

    /**
     * Test invalid derivation path
     */
    test('HDNode - from mnemonic - invalid derivation path', () => {
        expect(() => HDNode.fromMnemonic(words, 'INVALID')).toThrowError(
            InvalidHDNodeDerivationPathError
        );
    });

    /**
     * Test invalid mnemonic
     */
    test('HDNode - from mnemonic - invalid mnemonic', () => {
        expect(() => HDNode.fromMnemonic(wrongWords)).toThrowError(
            InvalidHDNodeMnemonicsError
        );
    });

    test('HDNode - from private key', () => {
        const parent = HDNode.fromPrivateKey(
            master.privateKey ?? ZERO_BUFFER(0),
            master.chainCode
        );
        for (let i = 0; i < 5; i++) {
            const child = parent.derive(i);
            // Correct address
            expect(
                Hex.canon(addressUtils.fromPublicKey(child.publicKey))
            ).toEqual(Hex.canon(addresses[i]));
            expect(Hex.canon(child.address)).toEqual(Hex.canon(addresses[i]));
            // Correct public key
            expect(
                Hex.of(
                    secp256k1.derivePublicKey(
                        child.privateKey ?? ZERO_BUFFER(0)
                    )
                )
            ).toEqual(Hex.of(child.publicKey));
        }
    });

    test('HDNode - from private key - invalid chain code', () => {
        expect(() =>
            HDNode.fromPrivateKey(ZERO_BUFFER(32), ZERO_BUFFER(31))
        ).toThrowError(InvalidHDNodeChaincodeError);
    });

    test('HDNode - from private key - invalid key', () => {
        expect(() =>
            HDNode.fromPrivateKey(ZERO_BUFFER(31), ZERO_BUFFER(32))
        ).toThrowError(InvalidHDNodePrivateKeyError);
    });

    test('HDNode - from public key', () => {
        const parent = HDNode.fromPublicKey(master.publicKey, master.chainCode);
        for (let i = 0; i < 5; i++) {
            const child = parent.derive(i);
            // Correct address
            expect(
                Hex.canon(addressUtils.fromPublicKey(child.publicKey))
            ).toEqual(Hex.canon(addresses[i]));
            expect(Hex.canon(child.address)).toEqual(Hex.canon(addresses[i]));
            // Null private key
            expect(child.privateKey).toEqual(null);
        }
    });

    test('HDNode - from public key - invalid chain code', () => {
        expect(() =>
            HDNode.fromPublicKey(ZERO_BUFFER(65), ZERO_BUFFER(31))
        ).toThrowError(InvalidHDNodeChaincodeError);
    });

    // test('HDNode - from public key - invalid key', () => {
    //     expect(() =>
    //         HDNode.fromPublicKey(ZERO_BUFFER(31), ZERO_BUFFER(32))
    //     ).toThrowError(InvalidHDNodePublicKeyError);
    // });
});
