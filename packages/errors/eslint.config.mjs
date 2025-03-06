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
                        "../logging"
                    ],

                    message: "Please import using @vechain/sdk-<the-module>",
                }],
            }],
        },
    }];
