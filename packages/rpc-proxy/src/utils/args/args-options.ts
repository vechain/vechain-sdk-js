import { Command, Option, type OptionValues } from 'commander';

/**
 * ********* START: TEMPORARY COMMENT *********
 * Some of the options are commented out because they are not implemented yet.
 * ********* END: TEMPORARY COMMENT ********
 *
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
 * rpc-proxy {-mc|--mnemonicCount} <count> - Number of accounts to derive from the mnemonic
 * rpc-proxy {-mi|--mnemonicInitialIndex} <index> - Initial index to start deriving accounts from the mnemonic
 *
 * rpc-proxy {-e|--enableDelegation} - Enable delegation
 * rpc-proxy {-dp|--delegatorPrivateKey} <delegatorPrivateKey> - Delegator private key
 * rpc-proxy {-du|--delegatorUrl} <delegatorUrl> - Delegator URL
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
        // .addOption(new Option('-e, --enableDelegation', 'Enable delegation'))

        // Delegator configuration (private key)
        // .addOption(
        //     new Option(
        //         '-dp, --delegatorPrivateKey <delegatorPrivateKey>',
        //         'Delegator private key'
        //     )
        // )

        // Delegator configuration (url)
        // .addOption(
        //     new Option('-du, --delegatorUrl <delegatorUrl>', 'Delegator URL')
        // )

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
