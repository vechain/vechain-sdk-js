import { addresses, words, wrongWords } from './fixture';
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
import {
    InvalidHDNodeChaincodeError,
    InvalidHDNodeDerivationPathError,
    InvalidHDNodeMnemonicsError,
    InvalidHDNodePrivateKeyError,
    InvalidHDNodePublicKeyError
} from '@vechain/sdk-errors';

/**
 * HDNode tests.
 * @group unit/hdnode
 */
describe('HDNode', () => {
    const master = HDNode.fromMnemonic(words);

    describe('HDNode = fromMnemonic', () => {
        test('HDNode - fromMnemonic - success', () => {
            for (let i = 0; i < 5; i++) {
                const child = master.derive(i);
                // Correct address
                expect(
                    Hex.canon(addressUtils.fromPublicKey(child.publicKey))
                ).toEqual(Hex.canon(addresses[i]));
                expect(Hex.canon(child.address)).toEqual(
                    Hex.canon(addresses[i])
                );
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

        test('HDNode - fromMnemonic - case insensitive check ', () => {
            const node = HDNode.fromMnemonic(words.map((w) => w.toUpperCase()));
            expect(node.address === master.address);
        });

        test('HDNode - fromMnemonic - custom word list lengths', () => {
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

        test('HDNode - from mnemonic - invalid derivation path', () => {
            expect(() => HDNode.fromMnemonic(words, 'INVALID')).toThrowError(
                InvalidHDNodeDerivationPathError
            );
        });

        test('HDNode - from mnemonic - invalid mnemonic', () => {
            expect(() => HDNode.fromMnemonic(wrongWords)).toThrowError(
                InvalidHDNodeMnemonicsError
            );
        });
    });

    describe('HDNode - fromPrivateKey', () => {
        test('HDNode - fromPrivateKey - success', () => {
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
                expect(Hex.canon(child.address)).toEqual(
                    Hex.canon(addresses[i])
                );
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
    });

    describe('HDNode - fromPrivateKey', () => {
        test('HDNode - from public key', () => {
            const parent = HDNode.fromPublicKey(
                master.publicKey,
                master.chainCode
            );
            for (let i = 0; i < 5; i++) {
                const child = parent.derive(i);
                // Correct address
                expect(
                    Hex.canon(addressUtils.fromPublicKey(child.publicKey))
                ).toEqual(Hex.canon(addresses[i]));
                expect(Hex.canon(child.address)).toEqual(
                    Hex.canon(addresses[i])
                );
                // Null private key
                expect(child.privateKey).toEqual(null);
            }
        });

        test('HDNode - from public key - invalid chain code', () => {
            expect(() =>
                HDNode.fromPublicKey(ZERO_BUFFER(65), ZERO_BUFFER(31))
            ).toThrowError(InvalidHDNodeChaincodeError);
        });

        test('HDNode - from public key - invalid key', () => {
            expect(() =>
                HDNode.fromPublicKey(ZERO_BUFFER(31), ZERO_BUFFER(32))
            ).toThrowError(InvalidHDNodePublicKeyError);
        });
    });

    describe('HDNode - of', () => {
        test('HDNode - of - success', () => {
            const path = '0/1/4/2/4/3';
            const expectedAddress = '0b41c56e19c5151122568873a039fea090937fe2';
            const expectedChainCode =
                '174469a247a1b891317af13b369b9d511996a74899b3991cde15b77e28c0f8d3';
            const expectedDerive0Address =
                '0x601e953c417DcF60cD349386fF3b349e7B5D6b77';
            const expectedPrivateKey =
                '66962cecff67bea483935c87fd33c6b6a524f06cc46430fa9591350bbd9f4999';
            const expectedPublicKey =
                '037ac6894cef5c061f608aaff2a01afa8055eddf3e2527297238733a3cfdd50e41';
            const node = HDNode.fromMnemonic(words).derivePath(path);
            expect(Hex.canon(node.address)).toBe(expectedAddress);
            expect(Hex.of(node.chainCode)).toBe(expectedChainCode);
            expect(node.derive(0).address).toBe(expectedDerive0Address);
            expect(node.privateKey).toBeDefined();
            if (node.privateKey != null) {
                expect(Hex.of(node.privateKey)).toBe(expectedPrivateKey);
            }
            expect(Hex.of(node.publicKey)).toBe(expectedPublicKey);
        });

        test('HDNode - of - invalid path', () => {
            const path = '0/1/4/2/4/3/h';
            try {
                HDNode.fromMnemonic(words).derivePath(path);
            } catch (error) {
                expect(
                    error instanceof InvalidHDNodeDerivationPathError
                ).toBeTruthy();
            }
        });
    });
});
