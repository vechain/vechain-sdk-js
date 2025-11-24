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
                        "../errors",
                        "../ethers-adapter",
                        "../hardhat-plugin",
                        "../logging",
                        "../network",
                        "../rpc-proxy",
                    ],
                    message: "Please import using @vechain/sdk-<the-module>",
                }],
            }],
            // Disable all sonarjs rules
            "sonarjs/no-base-to-string": "off",
            "sonarjs/no-unused-expressions": "off",
        },
    },
];
