"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeChainSDKLogger = void 0;
const log_logger_1 = require("./log-logger");
const error_logger_1 = require("./error-logger");
const warning_logger_1 = require("./warning-logger");
/**
 * Logger function that returns a log function based on the logger type.
 */
const VeChainSDKLogger = (loggerType) => {
    if (loggerType === 'error')
        return error_logger_1._logErrorFunction;
    if (loggerType === 'warning')
        return warning_logger_1._logWarningFunction;
    return log_logger_1._logLogFunction;
};
exports.VeChainSDKLogger = VeChainSDKLogger;
