/**
 * Addresses generated from the mnemonic above
 */
const addresses = [
    '0x339fb3c438606519e2c75bbf531fb43a0f449a70',
    '0x5677099d06bc72f9da1113afa5e022feec424c8e',
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
