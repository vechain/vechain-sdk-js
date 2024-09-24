/**
 * Get the CLI arguments from the environment variables
 *
 * @returns {string[]} The CLI arguments
 */
function getArgsFromEnv(): string[] {
    // Initial log
    console.log(`[rpc-proxy]: Running with Docker`);

    // Array of arguments to pass to the proxy
    const argsFromEnvOptions: string[] = ['node', 'dist/index.js'];

    // Init the CLI arguments from the environment variables

    // URL of the blockchain node
    if (process.env.URL !== undefined && process.env.URL !== null) {
        console.log(
            `[rpc-proxy]: Using URL from environment variable - ${process.env.URL}`
        );
        argsFromEnvOptions.push(`-u ${process.env.URL}`);
    }

    // Port to run the proxy on
    if (process.env.PORT !== undefined && process.env.PORT !== null) {
        console.log(
            `[rpc-proxy]: Using PORT from environment variable - ${process.env.PORT}`
        );
        argsFromEnvOptions.push(`-p ${process.env.PORT}`);
    }

    // Accounts to use for signing transactions
    if (process.env.ACCOUNTS !== undefined && process.env.ACCOUNTS !== null) {
        console.log(
            `[rpc-proxy]: Using ACCOUNTS from environment variable - (Hidden for security reasons)`
        );
        argsFromEnvOptions.push(`-a ${process.env.ACCOUNTS}`);
    }

    // Mnemonic to use for signing transactions
    if (process.env.MNEMONIC !== undefined && process.env.MNEMONIC !== null) {
        console.log(
            `[rpc-proxy]: Using MNEMONIC from environment variable - (Hidden for security reasons)`
        );
        argsFromEnvOptions.push(`-m ${process.env.MNEMONIC}`);
    }

    // Number of accounts to derive from the mnemonic
    if (
        process.env.MNEMONIC_COUNT !== undefined &&
        process.env.MNEMONIC_COUNT !== null
    ) {
        console.log(
            `[rpc-proxy]: Using MNEMONIC_COUNT from environment variable - ${process.env.MNEMONIC_COUNT}`
        );
        argsFromEnvOptions.push(`-mc ${process.env.MNEMONIC_COUNT}`);
    }

    // Initial index to start deriving accounts from the mnemonic
    if (
        process.env.MNEMONIC_INITIAL_INDEX !== undefined &&
        process.env.MNEMONIC_INITIAL_INDEX !== null
    ) {
        console.log(
            `[rpc-proxy]: Using MNEMONIC_INITIAL_INDEX from environment variable - ${process.env.MNEMONIC_INITIAL_INDEX}`
        );
        argsFromEnvOptions.push(`-mi ${process.env.MNEMONIC_INITIAL_INDEX}`);
    }

    // Enable or disable delegation
    if (
        process.env.ENABLE_DELEGATION !== undefined &&
        process.env.ENABLE_DELEGATION !== null
    ) {
        console.log(
            `[rpc-proxy]: Using ENABLE_DELEGATION from environment variable - ${process.env.ENABLE_DELEGATION}`
        );
        argsFromEnvOptions.push('-e');
    }

    // Delegator private key
    if (
        process.env.DELEGATOR_PRIVATE_KEY !== undefined &&
        process.env.DELEGATOR_PRIVATE_KEY !== null
    ) {
        console.log(
            `[rpc-proxy]: Using DELEGATOR_PRIVATE_KEY from environment variable - (Hidden for security reasons)`
        );
        argsFromEnvOptions.push(`-dp ${process.env.DELEGATOR_PRIVATE_KEY}`);
    }

    // Delegator URL
    if (
        process.env.DELEGATOR_URL !== undefined &&
        process.env.DELEGATOR_URL !== null
    ) {
        console.log(
            `[rpc-proxy]: Using DELEGATOR_URL from environment variable - ${process.env.DELEGATOR_URL}`
        );
        argsFromEnvOptions.push(`-du ${process.env.DELEGATOR_URL}`);
    }

    // Enable verbose logging
    if (process.env.VERBOSE !== undefined && process.env.VERBOSE !== null) {
        console.log(`[rpc-proxy]: Using VERBOSE from environment variable`);
        argsFromEnvOptions.push('-v');
    }

    // Set custom configuration file
    if (
        process.env.CONFIGURATION_FILE !== undefined &&
        process.env.CONFIGURATION_FILE !== null
    ) {
        console.log(
            `[rpc-proxy]: Using CONFIGURATION_FILE from environment variable - ${process.env.CONFIGURATION_FILE}`
        );
        argsFromEnvOptions.push(`-c ${process.env.CONFIGURATION_FILE}`);
    }

    // Start the proxy
    return argsFromEnvOptions;
}

export { getArgsFromEnv };
