"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._logWarningFunction = void 0;
/**
 * Warning logger internal function.
 */
const _logWarningFunction = {
    log: (data) => {
        // Convert messages to string
        const messagesAsString = data.messages
            .map((message) => `- ${message}`)
            .join('\n');
        console.warn(`\n****************** WARNING: ${data.title} ******************\n` +
            messagesAsString +
            `\n`);
    }
};
exports._logWarningFunction = _logWarningFunction;
