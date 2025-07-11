import baseConfig from "../../eslint.config.mjs";

export default [
    ...baseConfig,
    {
        // Exclude coverage files from linting
        ignores: ["**/coverage/**", "**/coverageIntegration/**"],
    },
    {
        rules: {
            // Using no-restricted-imports instead of import/no-restricted-paths
            "no-restricted-imports": ["error", {
                patterns: [{
                    group: ["../aws-kms-adapter", "../core", "../errors", "../ethers-adapter", "../hardhat-plugin", "../logging", "../rpc-proxy"],
                    message: "Please import using @vechain/sdk-<the-module>",
                }],
            }],
        },
    }];