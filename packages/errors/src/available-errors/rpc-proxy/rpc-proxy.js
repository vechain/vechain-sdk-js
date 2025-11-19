"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidConfigurationFile = exports.InvalidConfigurationFilePath = exports.InvalidCommandLineArguments = void 0;
const sdk_error_1 = require("../sdk-error");
/**
 * Invalid command line arguments
 *
 * WHEN TO USE:
 * * When the RPC proxy is called with invalid command line arguments
 */
class InvalidCommandLineArguments extends sdk_error_1.VechainSDKError {
}
exports.InvalidCommandLineArguments = InvalidCommandLineArguments;
/**
 * Invalid configuration file path
 *
 * WHEN TO USE:
 * * When the configuration file path given as input is invalid
 */
class InvalidConfigurationFilePath extends sdk_error_1.VechainSDKError {
}
exports.InvalidConfigurationFilePath = InvalidConfigurationFilePath;
/**
 * Invalid configuration file
 *
 * WHEN TO USE:
 * * When the configuration file given as input is invalid
 */
class InvalidConfigurationFile extends sdk_error_1.VechainSDKError {
}
exports.InvalidConfigurationFile = InvalidConfigurationFile;
