import { describe, expect, test } from '@jest/globals';
import {
    HDNode,
    type WordlistSizeType,
    ZERO_BUFFER,
    addressUtils,
    mnemonic,
    secp256k1
} from '../../src';
import { addresses, words, wrongWords } from './fixture';
import {
    InvalidHDNodeChaincodeError,
    InvalidHDNodeDerivationPathError,
    InvalidHDNodeMnemonicsError,
    InvalidHDNodePrivateKeyError,
    InvalidHDNodePublicKeyError
} from '@vechain/vechain-sdk-errors';

/**
 * Mnemonic tests
 * @group unit/hdnode
 */
describe('Hdnode', () => {
    /**
     * Test HD Node
     */
    test('HD Node', () => {
        // HdNode from mnemonic
        const node = HDNode.fromMnemonic(words);

        for (let i = 0; i < 5; i++) {
            const child = node.derive(i);

            // Correct address
            expect(
                addressUtils.fromPublicKey(child.publicKey).slice(2)
            ).toEqual(addresses[i]);
            expect(child.address).toEqual('0x' + addresses[i]);

            // Correct public key
            expect(
                secp256k1
                    .derivePublicKey(child.privateKey ?? ZERO_BUFFER(0))
                    .toString('hex')
            ).toEqual(child.publicKey.toString('hex'));
        }

        // HDNode from private key
        const xprivNode = HDNode.fromPrivateKey(
            node.privateKey ?? ZERO_BUFFER(0),
            node.chainCode
        );
        for (let i = 0; i < 5; i++) {
            const child = xprivNode.derive(i);
            // Correct address
            expect(
                addressUtils.fromPublicKey(child.publicKey).slice(2)
            ).toEqual(addresses[i]);
            expect(child.address).toEqual('0x' + addresses[i]);

            // Correct public key
            expect(
                secp256k1
                    .derivePublicKey(child.privateKey ?? ZERO_BUFFER(0))
                    .toString('hex')
            ).toEqual(child.publicKey.toString('hex'));
        }

        // HDNode from public key
        const xpubNode = HDNode.fromPublicKey(node.publicKey, node.chainCode);
        for (let i = 0; i < 5; i++) {
            const child = xpubNode.derive(i);
            // Correct address
            expect(
                addressUtils.fromPublicKey(child.publicKey).slice(2)
            ).toEqual(addresses[i]);
            expect(child.address).toEqual('0x' + addresses[i]);

            // Null private key
            expect(child.privateKey).toEqual(null);
        }

        // non-lowercase
        const node2 = HDNode.fromMnemonic(words.map((w) => w.toUpperCase()));
        expect(node.address === node2.address);
    });

    /**
     * Test HD Node from mnemonics with custom lengths
     */
    test('HD Node from mnemonics with custom lengths', () => {
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
     * Test invalid mnemonic
     */
    test('Invalid mnemonic', () => {
        expect(() => HDNode.fromMnemonic(wrongWords)).toThrowError(
            InvalidHDNodeMnemonicsError
        );
    });

    /**
     * Test invalid derivation path
     */
    test('Invalid derivation path', () => {
        expect(() => HDNode.fromMnemonic(words, 'INVALID')).toThrowError(
            InvalidHDNodeDerivationPathError
        );
    });

    /**
     * Test invalid private key
     */
    test('Invalid private key', () => {
        expect(() =>
            HDNode.fromPrivateKey(ZERO_BUFFER(31), ZERO_BUFFER(32))
        ).toThrowError(InvalidHDNodePrivateKeyError);
    });

    /**
     * Test invalid public key
     */
    test('Invalid public key', () => {
        expect(() =>
            HDNode.fromPublicKey(ZERO_BUFFER(31), ZERO_BUFFER(32))
        ).toThrowError(InvalidHDNodePublicKeyError);
    });

    /**
     * Test invalid chain code - private key
     */
    test('Invalid chain code private key', () => {
        expect(() =>
            HDNode.fromPrivateKey(ZERO_BUFFER(32), ZERO_BUFFER(31))
        ).toThrowError(InvalidHDNodeChaincodeError);
    });

    /**
     * Test invalid chain code - public key
     */
    test('Invalid chain code public key', () => {
        expect(() =>
            HDNode.fromPublicKey(ZERO_BUFFER(65), ZERO_BUFFER(31))
        ).toThrowError(InvalidHDNodeChaincodeError);
    });
});
