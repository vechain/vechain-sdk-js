import { assert, SECP256K1 } from '@vechain/sdk-errors';

/**
 * Assert if private key is valid
 *
 * @param methodName - The name of the method calling this assertion.
 * @param methodName - The name of the method calling this assertion.
 * @param privateKey - Private key to assert
 * @param isValidPrivateKeyFunction - Function to assert private key
 */
function assertIsValidPrivateKey(
    methodName: string,
    privateKey: Uint8Array,
    isValidPrivateKeyFunction: (privateKey: Uint8Array) => boolean
): void {
    assert(
        `assertIsValidPrivateKey - ${methodName}`,
        isValidPrivateKeyFunction(privateKey),
        SECP256K1.INVALID_SECP256k1_PRIVATE_KEY,
        'Invalid private key given as input. Ensure it is a valid 32-byte secp256k1 private key.',
        { privateKey }
    );
}

/**
 * Assert if message hash is valid
 *
 * @param methodName - The name of the method calling this assertion.
 * @param msgHash - Message hash to assert
 * @param isValidMessageHashFunction - Function to assert message hash
 */
function assertIsValidSecp256k1MessageHash(
    methodName: string,
    msgHash: Uint8Array,
    isValidMessageHashFunction: (messageHash: Uint8Array) => boolean
): void {
    assert(
        `assertIsValidSecp256k1MessageHash - ${methodName}`,
        isValidMessageHashFunction(msgHash),
        SECP256K1.INVALID_SECP256k1_MESSAGE_HASH,
        'Invalid private key given as input. Ensure it is a valid 32-byte secp256k1 private key.',
        { msgHash }
    );
}

export { assertIsValidPrivateKey, assertIsValidSecp256k1MessageHash };
