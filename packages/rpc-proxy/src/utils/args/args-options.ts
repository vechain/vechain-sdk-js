import { Command, Option, type OptionValues } from 'commander';

/**
 * Get the command line arguments options
 * @param proxyVersion - Version of the proxy
 * @returns Command line arguments options
 */
function getOptionsFromCommandLine(proxyVersion: string): OptionValues {
    // Create the program to parse the command line arguments and options
    const program = new Command();

    // Set the program version and description and command line options
    program
        .version(proxyVersion)
        .description('VeChain RPC Proxy')

        // URL of the blockchain node
        // Syntax: -u <url> OR --url <url>
        .addOption(new Option('-u, --url <url>', 'URL of the blockchain node'))

        // Port to run the proxy on (optional)
        // Syntax: -p <port> OR --port <port>
        .addOption(new Option('-p, --port <port>', 'Port to run the proxy on'))

        // Accounts to use for signing transactions (LIST OF PRIVATE KEYS)
        .addOption(
            new Option(
                '-a, --accounts <accounts>',
                'List of accounts private keys to use for signing transactions'
            )
        )

        // Accounts to use for signing transactions (HD WALLET MNEUMONIC)
        .addOption(
            new Option(
                '-m, --mnemonic <mnemonic>',
                'Mnemonic to use for signing transactions'
            )
        )
        .addOption(
            new Option(
                '-mc, --mnemonicCount <count>',
                'Number of accounts to derive from the mnemonic'
            )
        )
        .addOption(
            new Option(
                '-mi, --mnemonicInitialIndex <index>',
                'Initial index to start deriving accounts from the mnemonic'
            )
        )

        // Enable delegation boolean
        .addOption(new Option('-e, --enableDelegation', 'Enable delegation'))

        // Delegator configuration (private key)
        .addOption(
            new Option(
                '-dp, --delegatorPrivateKey <delegatorPrivateKey>',
                'Delegator private key'
            )
        )

        // Delegator configuration (url)
        .addOption(
            new Option('-du, --delegatorUrl <delegatorUrl>', 'Delegator URL')
        )

        // Enable verbose logging
        .addOption(new Option('-v, --verbose', 'Enable verbose logging'))

        // Configuration file
        .addOption(
            new Option(
                '-c, --configurationFile <configuration_file_path>',
                'Path to configuration file'
            )
        )

        // Get the options from the command line arguments
        .parse(process.argv);

    // Return the options
    return program.opts();
}

export { getOptionsFromCommandLine };
