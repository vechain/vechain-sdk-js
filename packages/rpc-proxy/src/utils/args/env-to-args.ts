/**
 * Get a cli field from an environment variable
 * @param field The field to get
 * @param envVarValue The environment variable value
 * @param envVarName The name of the environment variable
 * @returns {string[]} The cli field
 */
function getCliFieldFromEnv(
    field: string,
    envVarValue: string | undefined,
    envVarName: string
): string[] {
    // Variable is defined
    if (envVarValue !== undefined) {
        console.log(`[rpc-proxy]: Get ${envVarName} from environment variable`);
        return [field, envVarValue];
    }
    return [];
}

/**
 * Get the CLI arguments from the environment variables
 *
 * @returns {string[]} The CLI arguments
 */
function getArgsFromEnv(): string[] {
    // Initial log
    console.log(`[rpc-proxy]: Running with Docker`);

    // Array of arguments to pass to the proxy
    const argsFromEnvOptions: string[] = ['node', 'dist/index.js'].concat(
        getCliFieldFromEnv('-u', process.env.URL, 'URL'),
        getCliFieldFromEnv('-p', process.env.PORT, 'PORT'),
        getCliFieldFromEnv('-a', process.env.ACCOUNTS, 'ACCOUNTS'),
        getCliFieldFromEnv('-m', process.env.MNEMONIC, 'MNEMONIC'),
        getCliFieldFromEnv(
            '--mnemonicCount',
            process.env.MNEMONIC_COUNT,
            'MNEMONIC_COUNT'
        ),
        getCliFieldFromEnv(
            '--mnemonicInitialIndex',
            process.env.MNEMONIC_INITIAL_INDEX,
            'MNEMONIC_INITIAL_INDEX'
        ),
        getCliFieldFromEnv(
            '-e',
            process.env.ENABLE_DELEGATION,
            'ENABLE_DELEGATION'
        ),
        getCliFieldFromEnv(
            '--delegatorPrivateKey',
            process.env.DELEGATOR_PRIVATE_KEY,
            'DELEGATOR_PRIVATE_KEY'
        ),
        getCliFieldFromEnv('-d', process.env.DELEGATOR_URL, 'DELEGATOR_URL'),
        getCliFieldFromEnv('-v', process.env.VERBOSE, 'VERBOSE'),
        getCliFieldFromEnv(
            '-c',
            process.env.CONFIGURATION_FILE,
            'CONFIGURATION_FILE'
        )
    );

    // Start the proxy
    return argsFromEnvOptions;
}

export { getArgsFromEnv };
