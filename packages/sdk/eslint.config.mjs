import baseConfig from "../../eslint.config.mjs";

export default [
    ...baseConfig,
    {
        rules: {
            "import/no-restricted-paths": ["error", {
                zones: [{
                    target: "./src",
                    from: [
                        "../errors",
                        "../logging"
                    ],
                    message: "Please import using @vechain/sdk-<the-module>",
                }],
            }],
            "sonarjs/cognitive-complexity": "off",
            
            // Disable unsafe type checking rules for Viem layer compatibility
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-construction": "off",
            "@typescript-eslint/no-redundant-type-constituents": "off",
            "@typescript-eslint/return-await": "off",
        },
    },
];
