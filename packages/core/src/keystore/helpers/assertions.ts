import { assert, SECP256K1 } from '@vechain/vechain-sdk-errors';

/**
 * Assert if private key is valid
 *
 * @param privateKey - Private key to assert
 * @param isValidPrivateKeyFunction - Function to assert private key
 */
function assertIsValidPrivateKey(
    privateKey: Buffer,
    isValidPrivateKeyFunction: (privateKey: Buffer) => boolean
): void {
    assert(
        isValidPrivateKeyFunction(privateKey),
        SECP256K1.INVALID_SECP256k1_PRIVATE_KEY,
        'Invalid private key given as input. Ensure it is a valid 32-byte SECP256k1 private key.',
        { privateKey }
    );
}

/**
 * Assert if message hash is valid
 *
 * @param msgHash - Message hash to assert
 * @param isValidMessageHashFunction - Function to assert message hash
 */
function assertIsValidSecp256k1MessageHash(
    msgHash: Buffer,
    isValidMessageHashFunction: (messageHash: Buffer) => boolean
): void {
    assert(
        isValidMessageHashFunction(msgHash),
        SECP256K1.INVALID_SECP256k1_MESSAGE_HASH,
        'Invalid private key given as input. Ensure it is a valid 32-byte SECP256k1 private key.',
        { msgHash }
    );
}

export { assertIsValidPrivateKey, assertIsValidSecp256k1MessageHash };
