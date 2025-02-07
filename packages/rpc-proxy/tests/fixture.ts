import path from 'path';

/**
 * Directory with the configuration files.
 */
const _configFilesDirectory = path.join(__dirname, 'config-files-fixtures');

/**
 * Default configuration file fixture.
 * This is the default configuration file.
 */
const correctConfigurationFilePathFixture = [
    path.join(
        _configFilesDirectory,
        'correct-proxy-config-accounts-mnemonic.json'
    ),
    path.join(
        _configFilesDirectory,
        'correct-proxy-config-accounts-list-of-private-keys.json'
    ),
    path.join(
        _configFilesDirectory,
        'correct-proxy-config-gas-payer-private-key.json'
    ),
    path.join(_configFilesDirectory, 'correct-proxy-config-gas-payer-url.json')
];

/**
 * Invalid configuration file fixture.
 * This is an invalid JSON configuration file.
 */
const invalidJSONConfigurationFilePathFixture = path.join(
    _configFilesDirectory,
    'invalid-json-format-proxy-config'
);

/**
 * Invalid parameters configuration file fixtures.
 */
const invalidParametersConfigurationFilePathFixture = {
    'invalid-port': [
        path.join(
            _configFilesDirectory,
            'invalid-port-proxy-config-negative-number.json'
        ),
        path.join(
            _configFilesDirectory,
            'invalid-port-proxy-config-non-integer.json'
        )
    ],
    'invalid-url': [
        path.join(_configFilesDirectory, 'invalid-url-proxy-config.json')
    ],
    'invalid-accounts': [
        path.join(
            _configFilesDirectory,
            'invalid-accounts-list-of-private-keys-proxy-config-1.json'
        ),
        path.join(
            _configFilesDirectory,
            'invalid-accounts-list-of-private-keys-proxy-config-2.json'
        ),
        path.join(
            _configFilesDirectory,
            'invalid-accounts-mnemonics-proxy-config-1.json'
        ),
        path.join(
            _configFilesDirectory,
            'invalid-accounts-mnemonics-proxy-config-2.json'
        ),
        path.join(
            _configFilesDirectory,
            'invalid-accounts-mnemonics-proxy-config-3.json'
        ),
        path.join(
            _configFilesDirectory,
            'invalid-accounts-mnemonics-proxy-config-4.json'
        ),
        path.join(
            _configFilesDirectory,
            'invalid-accounts-mnemonics-proxy-config-5.json'
        )
    ],
    'invalid-delegator': [
        path.join(
            _configFilesDirectory,
            'invalid-gas-payer-proxy-config-1.json'
        ),
        path.join(
            _configFilesDirectory,
            'invalid-gas-payer-proxy-config-2.json'
        ),
        path.join(
            _configFilesDirectory,
            'invalid-gas-payer-proxy-config-3.json'
        )
    ],
    'invalid-verbose': [
        path.join(
            _configFilesDirectory,
            'invalid-verbose-flag-proxy-config-1.json'
        )
    ],
    'invalid-enable-delegation': [
        path.join(
            _configFilesDirectory,
            'invalid-enable-delegation-proxy-config-1.json'
        )
    ]
};

/**
 * Invalid semantic configuration file fixtures.
 */
const invalidSemanticConfigurationFilePathFixture = [
    path.join(_configFilesDirectory, 'invalid-semantic-proxy-config-1.json')
];

export {
    correctConfigurationFilePathFixture,
    invalidJSONConfigurationFilePathFixture,
    invalidParametersConfigurationFilePathFixture,
    invalidSemanticConfigurationFilePathFixture
};
