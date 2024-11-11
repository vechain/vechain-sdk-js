import baseConfig from "../../eslint.config.mjs";

export default [
    ...baseConfig,
    {
        rules: {
            "import/no-restricted-paths": ["error", {
                zones: [{
                    target: "./src",

                    from: [
                        "../aws-kms-adapter",
                        "../core",
                        "../errors",
                        "../hardhat-plugin",
                        "../logging",
                        "../network",
                        "../rpc-proxy",
                    ],

                    message: "Please import using @vechain/sdk-<the-module>",
                }],
            }],
        },
    }];