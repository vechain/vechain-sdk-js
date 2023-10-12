/**
 * Correct mnemonic
 */
const words =
    'ignore empty bird silly journey junior ripple have guard waste between tenant'.split(
        ' '
    );

/**
 * Addresses generated from the mnemonic above
 */
const addresses = [
    '339Fb3C438606519E2C75bbf531fb43a0F449A70',
    '5677099D06Bc72f9da1113aFA5e022feEc424c8E',
    '86231b5CDCBfE751B9DdCD4Bd981fC0A48afe921',
    'd6f184944335f26Ea59dbB603E38e2d434220fcD',
    '2AC1a0AeCd5C80Fb5524348130ab7cf92670470A'
];

/**
 * Wrong mnemonic
 */
const wrongWords =
    'ignore empty bird silly journey junior ripple have guard waste between'.split(
        ' '
    );

export { words, wrongWords, addresses };
