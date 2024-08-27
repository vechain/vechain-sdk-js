import path from 'path';

/**
 * Directory with the configuration files.
 */
const _configFilesDirectory = path.join(__dirname, 'config-files-fixtures');

/**
 * Default configuration file fixture.
 * This is the default configuration file.
 */
const defaultConfigurationFilePathFixture = path.join(
    _configFilesDirectory,
    'default-proxy-config.json'
);

/**
 * Invalid configuration file fixture.
 * This is an invalid JSON configuration file.
 */
const invalidJSONConfigurationFilePathFixture = path.join(
    _configFilesDirectory,
    'invalid-json-proxy-config'
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
    ]
};

export {
    defaultConfigurationFilePathFixture,
    invalidJSONConfigurationFilePathFixture,
    invalidParametersConfigurationFilePathFixture
};
