"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._logLogFunction = void 0;
/**
 * Log logger internal function.
 */
const _logLogFunction = {
    log: (data) => {
        // Convert messages to string
        const messagesAsString = data.messages
            .map((message) => `- ${message}`)
            .join('\n');
        console.log(`\n****************** EVENT: ${data.title} ******************\n` +
            messagesAsString +
            `\n`);
    }
};
exports._logLogFunction = _logLogFunction;
