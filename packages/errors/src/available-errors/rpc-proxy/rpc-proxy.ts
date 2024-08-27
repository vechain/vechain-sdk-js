import { VechainSDKError } from '../sdk-error';

/**
 * Invalid command line arguments
 *
 * WHEN TO USE:
 * * When the RPC proxy is called with invalid command line arguments
 */
class InvalidCommandLineArguments extends VechainSDKError<{
    flag: string;
    value: string;
}> {}

/**
 * Invalid configuration file path
 *
 * WHEN TO USE:
 * * When the configuration file path given as input is invalid
 */
class InvalidConfigurationFilePath extends VechainSDKError<{
    filePath: string;
}> {}

/**
 * Invalid configuration file
 *
 * WHEN TO USE:
 * * When the configuration file given as input is invalid
 */
class InvalidConfigurationFile extends VechainSDKError<{
    filePath?: string;
    wrongField?: string;
    message?: string;
}> {}

export {
    InvalidCommandLineArguments,
    InvalidConfigurationFilePath,
    InvalidConfigurationFile
};
