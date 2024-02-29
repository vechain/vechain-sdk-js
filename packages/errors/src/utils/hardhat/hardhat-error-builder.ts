import { HardhatPluginError } from 'hardhat/plugins';

/**
 * Build a hardhat error.
 * Basically a HardhatPluginError with the plugin name set to '@vechain/vechain-sdk-hardhat-plugin'.
 *
 * @param message - The error message.
 * @param innerError - The inner error.
 */
const buildHardhatError = (
    message: string,
    innerError?: Error
): HardhatPluginError => {
    return new HardhatPluginError(
        '@vechain/vechain-sdk-hardhat-plugin',
        message,
        innerError
    );
};

export { buildHardhatError };
