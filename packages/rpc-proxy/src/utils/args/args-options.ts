import { Command, Option, type OptionValues } from 'commander';

/**
 * Get the command line arguments options
 *
 * Options:
 * rpc-proxy {-u|--url} <url> - The URL of the blockchain node
 * rpc-proxy {-p|--port} <port> - The port to run the proxy on
 *
 * rpc-proxy {-a|--accounts} <accounts> - List of accounts private keys to use for signing transactions
 * * Where accounts is a space separated list of private keys (e.g. "PK1 PK2 PK3 ...")
 *
 * rpc-proxy {-m|--mnemonic} <mnemonic> - Mnemonic to use for signing transactions
 * rpc-proxy {--mnemonicCount} <count> - Number of accounts to derive from the mnemonic
 * rpc-proxy {--mnemonicInitialIndex} <index> - Initial index to start deriving accounts from the mnemonic
 *
 * rpc-proxy {-e|--enableDelegation} - Enable delegation
 * rpc-proxy {--gasPayerPrivateKey} <gasPayerPrivateKey> - The gasPayer private key
 * rpc-proxy {-s|--gasPayerServiceUrl} <gasPayerServiceUrl> - The gasPayer service URL
 *
 * rpc-proxy {-v|--verbose} - Enable verbose logging
 *
 * rpc-proxy {-c|--configurationFile} <configuration_file_path> - Path to configuration file
 *
 * @param proxyVersion - Version of the proxy
 * @param source - Source of the command line arguments to parse
 * @returns Command line arguments options
 */
function getOptionsFromCommandLine(
    proxyVersion: string,
    source: string[]
): OptionValues {
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

        // Accounts to use for signing transactions (HD WALLET MNEMONIC)
        .addOption(
            new Option(
                '-m, --mnemonic <mnemonic>',
                'Mnemonic to use for signing transactions'
            )
        )
        .addOption(
            new Option(
                '--mnemonicCount <count>',
                'Number of accounts to derive from the mnemonic'
            )
        )
        .addOption(
            new Option(
                '--mnemonicInitialIndex <index>',
                'Initial index to start deriving accounts from the mnemonic'
            )
        )

        // Enable delegation boolean
        .addOption(new Option('-e, --enableDelegation', 'Enable delegation'))

        // The gasPayer configuration (private key)
        .addOption(
            new Option(
                '--gasPayerPrivateKey <gasPayerPrivateKey>',
                'The gasPayer private key'
            )
        )

        // The gasPayer configuration (url)
        .addOption(
            new Option(
                '-s, --gasPayerServiceUrl <gasPayerServiceUrl>',
                'The gasPayer service URL'
            )
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
        .parse(source);

    // Return the options
    return program.opts();
}

export { getOptionsFromCommandLine };
