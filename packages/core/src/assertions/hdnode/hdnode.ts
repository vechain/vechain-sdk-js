import { assert, HDNODE } from '@vechain/sdk-errors';
import { isDerivationPathValid } from '../../utils';

/**
 * Asserts that the derivation path is valid.
 *
 * @param methodName - The name of the method calling this assertion.
 * @param path - The derivation path to validate.
 */
function assertIsValidHdNodeDerivationPath(
    methodName: string,
    path: string
): void {
    assert(
        'assertIsValidHdNodeDerivationPath',
        isDerivationPathValid(path),
        HDNODE.INVALID_HDNODE_DERIVATION_PATH,
        'Invalid derivation path. Ensure the path adheres to the standard format.',
        { path }
    );
}

/**
 * Asserts that the chain code is valid.
 *
 * @param methodName - The name of the method calling this assertion.
 * @param chainCode - The chain code to validate.
 */
function assertIsValidHdNodeChainCode(
    methodName: string,
    chainCode: Buffer
): void {
    assert(
        'assertIsValidHdNodeChainCode',
        chainCode.length === 32,
        HDNODE.INVALID_HDNODE_CHAIN_CODE,
        'Invalid chain code. Length must be exactly 32 bytes.',
        { chainCode }
    );
}

export { assertIsValidHdNodeDerivationPath, assertIsValidHdNodeChainCode };
