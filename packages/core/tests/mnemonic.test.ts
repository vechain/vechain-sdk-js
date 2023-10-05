import { describe, expect, test } from '@jest/globals';
import { mnemonic } from '../src/mnemonic/mnemonic';
import { HDNode } from '../src/hdnode/hdnode';
import { address } from '../src/address/address';
import { secp256k1 } from '../src/secp256k1/secp256k1';
import { ZERO_BUFFER } from '../src';

describe('mnemonic', () => {
    const words =
        'ignore empty bird silly journey junior ripple have guard waste between tenant'.split(
            ' '
        );

    test('generate', () => {
        expect(mnemonic.generate().phrase.split(' ').length).toEqual(12);
    });
    test('validate', () => {
        expect(mnemonic.validate(['hello', 'world'])).toEqual(false);
        expect(
            mnemonic.validate(mnemonic.generate().phrase.split(' '))
        ).toEqual(true);
    });
    test('derive private key', () => {
        expect(mnemonic.derivePrivateKey(words).toString('hex')).toEqual(
            '27196338e7d0b5e7bf1be1c0327c53a244a18ef0b102976980e341500f492425'
        );
    });
    test('derive private key with standard derivation path', () => {
        expect(mnemonic.derivePrivateKey(words, '0').toString('hex')).toEqual(
            '27196338e7d0b5e7bf1be1c0327c53a244a18ef0b102976980e341500f492425'
        );
    });
    test('derive private key with a custom derivation path', () => {
        expect(mnemonic.derivePrivateKey(words, '0/1').toString('hex')).toEqual(
            'fbbd4e92d4ee4ca2e985648599abb4e95b0886b4e0390b7bfc365283a7befc86'
        );
    });
    test('derive private key with a custom deep derivation path', () => {
        expect(
            mnemonic.derivePrivateKey(words, '0/1/4/2/4/3').toString('hex')
        ).toEqual(
            '66962cecff67bea483935c87fd33c6b6a524f06cc46430fa9591350bbd9f4999'
        );
    });
    test('derive address', () => {
        expect(mnemonic.deriveAddress(words)).toEqual(
            '0x339Fb3C438606519E2C75bbf531fb43a0F449A70'
        );
    });
    test('derive address with standard derivation path', () => {
        expect(mnemonic.deriveAddress(words, '0')).toEqual(
            '0x339Fb3C438606519E2C75bbf531fb43a0F449A70'
        );
    });
    test('derive address with a custom derivation path', () => {
        expect(mnemonic.deriveAddress(words, '0/1')).toEqual(
            '0x43e60f60C89333121236226B7ADC884DC2a8847a'
        );
    });
    test('derive address with a custom deep derivation path', () => {
        expect(mnemonic.deriveAddress(words, '0/1/4/2/4/3')).toEqual(
            '0x0b41c56e19c5151122568873a039fEa090937Fe2'
        );
    });
    test('hdNode', () => {
        const node = HDNode.fromMnemonic(words);
        const addresses = [
            '339Fb3C438606519E2C75bbf531fb43a0F449A70',
            '5677099D06Bc72f9da1113aFA5e022feEc424c8E',
            '86231b5CDCBfE751B9DdCD4Bd981fC0A48afe921',
            'd6f184944335f26Ea59dbB603E38e2d434220fcD',
            '2AC1a0AeCd5C80Fb5524348130ab7cf92670470A'
        ];
        for (let i = 0; i < 5; i++) {
            const child = node.derive(i);
            expect(address.fromPublicKey(child.publicKey).slice(2)).toEqual(
                addresses[i]
            );
            expect(child.address).toEqual('0x' + addresses[i]);
            if (child.privateKey !== null) {
                expect(
                    secp256k1.derive(child.privateKey).toString('hex')
                ).toEqual(child.publicKey.toString('hex'));
            } else {
                expect(child.privateKey).toEqual(null);
            }
        }

        const xprivNode = HDNode.fromPrivateKey(
            node.privateKey ?? ZERO_BUFFER(64),
            node.chainCode
        );
        for (let i = 0; i < 5; i++) {
            const child = xprivNode.derive(i);
            expect(address.fromPublicKey(child.publicKey).slice(2)).toEqual(
                addresses[i]
            );
            expect(child.address).toEqual('0x' + addresses[i]);
            if (child.privateKey !== null) {
                expect(
                    secp256k1.derive(child.privateKey).toString('hex')
                ).toEqual(child.publicKey.toString('hex'));
            } else {
                expect(child.privateKey).toEqual(null);
            }
        }

        const xpubNode = HDNode.fromPublicKey(node.publicKey, node.chainCode);
        for (let i = 0; i < 5; i++) {
            const child = xpubNode.derive(i);
            expect(address.fromPublicKey(child.publicKey).slice(2)).toEqual(
                addresses[i]
            );
            expect(child.address).toEqual('0x' + addresses[i]);
            expect(child.privateKey).toEqual(null);
        }

        // non-lowercase
        const node2 = HDNode.fromMnemonic(words.map((w) => w.toUpperCase()));
        expect(node.address === node2.address);
    });
});
