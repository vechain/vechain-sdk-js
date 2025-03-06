import baseConfig from "../../eslint.config.mjs";

export default [
    ...baseConfig,
    {
        rules: {
            "import/no-restricted-paths": ["error", {
                zones: [{
                    target: "./src",

                    from: [
                        "../core",
                        "../errors",
                        "../ethers-adapter",
                        "../hardhat-plugin",
                        "../network",
                        "../rpc-proxy",
                    ],

                    message: "Please import using @vechain/sdk-<the-module>",
                }],
            }],
        },
    }];
