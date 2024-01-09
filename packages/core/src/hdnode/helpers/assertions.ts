import { assert, HDNODE } from '@vechain/vechain-sdk-errors';
import { isDerivationPathValid } from '../../utils';

/**
 * Asserts that the derivation path is valid.
 *
 * @param path - The derivation path to validate.
 */
function assertIsValidHdNodeDerivationPath(path: string): void {
    assert(
        isDerivationPathValid(path),
        HDNODE.INVALID_HDNODE_DERIVATION_PATH,
        'Invalid derivation path. Ensure the path adheres to the standard format.',
        { path }
    );
}

/**
 * Asserts that the chain code is valid.
 *
 * @param chainCode - The chain code to validate.
 */
function assertIsValidHdNodeChainCode(chainCode: Buffer): void {
    assert(
        chainCode.length === 32,
        HDNODE.INVALID_HDNODE_CHAIN_CODE,
        'Invalid chain code. Length must be exactly 32 bytes.',
        { chainCode }
    );
}

export { assertIsValidHdNodeDerivationPath, assertIsValidHdNodeChainCode };
