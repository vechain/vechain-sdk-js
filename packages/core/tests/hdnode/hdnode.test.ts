import { describe, expect, test } from '@jest/globals';
import { ERRORS, HDNode, ZERO_BUFFER, address, secp256k1 } from '../../src';
import { addresses, words, wrongWords } from './fixture';

/**
 * Mnemonic tests
 */
describe('Mnemonic', () => {
    /**
     * Test HD Node
     */
    test('HD Node', () => {
        // HdNode from mnemonic
        const node = HDNode.fromMnemonic(words);

        for (let i = 0; i < 5; i++) {
            const child = node.derive(i);

            // Correct address
            expect(address.fromPublicKey(child.publicKey).slice(2)).toEqual(
                addresses[i]
            );
            expect(child.address).toEqual('0x' + addresses[i]);

            // Correct pulic key
            expect(
                secp256k1
                    .derive(child.privateKey ?? ZERO_BUFFER(0))
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
            expect(address.fromPublicKey(child.publicKey).slice(2)).toEqual(
                addresses[i]
            );
            expect(child.address).toEqual('0x' + addresses[i]);

            // Correct public key
            expect(
                secp256k1
                    .derive(child.privateKey ?? ZERO_BUFFER(0))
                    .toString('hex')
            ).toEqual(child.publicKey.toString('hex'));
        }

        // HDNode from public key
        const xpubNode = HDNode.fromPublicKey(node.publicKey, node.chainCode);
        for (let i = 0; i < 5; i++) {
            const child = xpubNode.derive(i);
            // Correct address
            expect(address.fromPublicKey(child.publicKey).slice(2)).toEqual(
                addresses[i]
            );
            expect(child.address).toEqual('0x' + addresses[i]);

            // Null private key
            expect(child.privateKey).toEqual(null);
        }

        // non-lowercase
        const node2 = HDNode.fromMnemonic(words.map((w) => w.toUpperCase()));
        expect(node.address === node2.address);
    });

    /**
     * Test invalid mnemonic
     */
    test('Invalid mnemonic', () => {
        expect(() => HDNode.fromMnemonic(wrongWords)).toThrow(
            ERRORS.HDNODE.INVALID_MNEMONICS
        );
    });

    /**
     * Test invalid private key
     */
    test('Invalid private key', () => {
        expect(() =>
            HDNode.fromPrivateKey(ZERO_BUFFER(31), ZERO_BUFFER(32))
        ).toThrow(ERRORS.HDNODE.INVALID_PRIVATEKEY);
    });

    /**
     * Test invalid public key
     */
    test('Invalid public key', () => {
        expect(() =>
            HDNode.fromPublicKey(ZERO_BUFFER(31), ZERO_BUFFER(32))
        ).toThrow(ERRORS.HDNODE.INVALID_PUBLICKEY);
    });

    /**
     * Test invalid chain code - private key
     */
    test('Invalid chain code private key', () => {
        expect(() =>
            HDNode.fromPrivateKey(ZERO_BUFFER(32), ZERO_BUFFER(31))
        ).toThrow(ERRORS.HDNODE.INVALID_CHAINCODE);
    });

    /**
     * Test invalid chain code - public key
     */
    test('Invalid chain code public key', () => {
        expect(() =>
            HDNode.fromPublicKey(ZERO_BUFFER(65), ZERO_BUFFER(31))
        ).toThrow(ERRORS.HDNODE.INVALID_CHAINCODE);
    });
});
