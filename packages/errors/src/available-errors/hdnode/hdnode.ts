import { VechainSDKError } from '../sdk-error';

/**
 * Invalid HDNode mnemonic error.
 *
 * WHEN TO USE:
 * * This error will be thrown when the HDNode mnemonic is invalid.
 *
 * @note Data (mnemonic) is undefined for security reasons, the mnemonic should not be logged!
 */
class InvalidHDNodeMnemonic extends VechainSDKError<
    undefined | { wordlistSize: number }
> {}

/**
 * Invalid HDNode error.
 *
 * WHEN TO USE:
 * * This error will be thrown when the HDNode is invalid (derivation path / chainCode / public key parameters).
 */
class InvalidHDNode extends VechainSDKError<{
    derivationPath?: string;
    chainCode?: Uint8Array;
    publicKey?: Uint8Array;
}> {}

export { InvalidHDNodeMnemonic, InvalidHDNode };
