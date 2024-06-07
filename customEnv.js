const { TestEnvironment } = require('jest-environment-jsdom');

/**
 * Jest creates a new VM context for each test and doesn't add in all
 * the node globals.
 * We rectify this here.
 */
class CustomizedTestEnvironment extends TestEnvironment {
    constructor(config, context) {
        super(config, context);
    }

    async setup() {
        await super.setup();

        // These seem to be needed for @noble/hashes
        this.global.TextEncoder = globalThis.TextEncoder;
        this.global.Uint8Array = globalThis.Uint8Array;
    }
}

module.exports = CustomizedTestEnvironment;
