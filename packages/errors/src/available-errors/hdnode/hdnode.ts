import { VechainSDKError } from '../sdk-error';

/**
 * Invalid mnemonic error to be thrown when an invalid mnemonic key is detected.
 *
 * This error is thrown when an invalid mnemonic is detected.
 *
 * @note Data is undefined because for security reasons, the mnemonic should not be logged!
 */
class InvalidHDNodeMnemonic extends VechainSDKError<undefined> {}

/**
 * Invalid derivation path / chain code or public key error to be thrown when an invalid derivation path / chain code or public key is detected.
 *
 * This error is thrown when an invalid derivation path / chain code or public key is detected.
 */
class InvalidHDNode extends VechainSDKError<{
    derivationPath?: string;
    chainCode?: Uint8Array;
    publicKey?: Uint8Array;
}> {}

export { InvalidHDNodeMnemonic, InvalidHDNode };
