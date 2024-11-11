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
                        "../ethers-adapter",
                        "../hardhat-plugin",
                        "../logging",
                        "../network",
                    ],

                    message: "Please import using @vechain/sdk-<the-module>",
                }],
            }],
        },
    }];