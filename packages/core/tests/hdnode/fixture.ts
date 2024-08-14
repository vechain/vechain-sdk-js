/**
 * Addresses generated from the mnemonic above
 */
const addresses = [
    '0x339fb3C438606519E2c75bbf531fb43A0F449A70',
    '0x5677099D06Bc72F9dA1113aFA5E022FEec424c8e',
    '0x86231b5cdcbfe751b9ddcd4bd981fc0a48afe921',
    '0xd6f184944335f26ea59dbb603e38e2d434220fcd',
    '0x2ac1a0aecd5c80fb5524348130ab7cf92670470a'
];

/**
 * Correct mnemonic
 */
const words =
    'ignore empty bird silly journey junior ripple have guard waste between tenant'.split(
        ' '
    );

/**
 * Wrong mnemonic
 */
const wrongWords =
    'ignore empty bird silly journey junior ripple have guard waste between'.split(
        ' '
    );

/**
 * Wrong derivation path fixture.
 */
const wrongDerivationPath = '0/1/4/2/4/h';

export { addresses, words, wrongDerivationPath, wrongWords };
