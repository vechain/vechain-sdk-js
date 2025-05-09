import { describe } from '@jest/globals';
import { HDKey, Hex, Mnemonic } from '../../src';

describe('bug 2000', () => {
    const mnemonics = [
        'process',
        'spell',
        'distance',
        'daughter',
        'step',
        'glove',
        'moment',
        'exercise',
        'library',
        'check',
        'toward',
        'early'
    ];

    const derivationPath = "m/44'/818'/0'/0";

    test('test', () => {
        const hdnode = HDKey.fromMnemonic(mnemonics, derivationPath);
        for (let i = 0; i < 5; i++) {
            const a = hdnode.deriveChild(i);
            console.log(
                `A: ${i}: `,
                Hex.of(a.privateKey as Uint8Array).toString()
            );
            const path = `${derivationPath}/${i}`;
            const b = HDKey.fromMnemonic(mnemonics, path);
            console.log(
                `B: ${i}: `,
                Hex.of(b.privateKey as Uint8Array).toString()
            );
            expect(a.privateKey).toEqual(b.privateKey);
            const k = Mnemonic.toPrivateKey(mnemonics, path);
            console.log(`K: ${i}: `, Hex.of(k).toString());
            expect(a.privateKey).toEqual(k);
        }
    });

    test('root', () => {
        const hdk = HDKey.fromMnemonic(mnemonics, derivationPath);
        const k = Mnemonic.toPrivateKey(mnemonics, derivationPath);
        expect(hdk.privateKey).toEqual(k);
    });
});
