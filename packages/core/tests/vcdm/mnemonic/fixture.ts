import { type WordListRandomGeneratorSizeInBytes } from '@vcdm';
import { Secp256k1 } from '@secp256k1';

/**
 * Mnemonic words fixture.
 */
const words =
    'ignore empty bird silly journey junior ripple have guard waste between tenant'.split(
        ' '
    );

/**
 * Custom random generator with XOR
 */
const customRandomGeneratorWithXor = (
    numberOfBytes: WordListRandomGeneratorSizeInBytes
): Uint8Array => {
    const r1 = Secp256k1.randomBytes(numberOfBytes);
    const r2 = Secp256k1.randomBytes(numberOfBytes);
    return r1.map((byte, index) => byte ^ r2[index]);
};

/**
 * Derivation path fixture (using the words fixture above)
 */
const derivationPaths = [
    {
        testName: 'Derive private key',
        derivationPath: undefined,
        resultingPrivateKey:
            '0x27196338e7d0b5e7bf1be1c0327c53a244a18ef0b102976980e341500f492425',
        resultingAddress: '0x339Fb3C438606519E2C75bbf531fb43a0F449A70'
    },
    {
        testName: 'Derive private key with standard derivation path',
        derivationPath: 'm/0',
        resultingPrivateKey:
            '0x27196338e7d0b5e7bf1be1c0327c53a244a18ef0b102976980e341500f492425',
        resultingAddress: '0x339Fb3C438606519E2C75bbf531fb43a0F449A70'
    },
    {
        testName: 'Derive private key with custom derivation path',
        derivationPath: 'm/0/1',
        resultingPrivateKey:
            '0xfbbd4e92d4ee4ca2e985648599abb4e95b0886b4e0390b7bfc365283a7befc86',
        resultingAddress: '0x43e60f60C89333121236226B7ADC884DC2a8847a'
    },
    {
        testName: 'Derive private key with custom deep derivation path',
        derivationPath: 'm/0/1/4/2/4/3',
        resultingPrivateKey:
            '0x66962cecff67bea483935c87fd33c6b6a524f06cc46430fa9591350bbd9f4999',
        resultingAddress: '0x0b41c56e19c5151122568873a039fEa090937Fe2'
    }
];

/**
 * Wrong derivation path fixture.
 */
const wrongDerivationPath = 'm/0/1/4/2/4/h';

export {
    customRandomGeneratorWithXor,
    derivationPaths,
    words,
    wrongDerivationPath
};
