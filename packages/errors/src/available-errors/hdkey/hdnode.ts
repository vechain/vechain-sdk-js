import { VechainSDKError } from '../sdk-error';

/**
 * Invalid HDNode mnemonic error.
 *
 * WHEN TO USE:
 * * This error will be thrown when the HDKey mnemonic is invalid.
 *
 * @note Data (mnemonic) is undefined for security reasons, the mnemonic should not be logged!
 */
class InvalidHDKeyMnemonic extends VechainSDKError<
    undefined | { wordlistSize: number }
> {}

/**
 * Invalid HDNode error.
 *
 * WHEN TO USE:
 * * This error will be thrown when the HDKey is invalid (derivation path / chainCode / public key parameters).
 */
class InvalidHDKey extends VechainSDKError<{
    derivationPath?: string;
    chainCode?: Uint8Array;
    publicKey?: Uint8Array;
}> {}

export { InvalidHDKeyMnemonic, InvalidHDKey };
