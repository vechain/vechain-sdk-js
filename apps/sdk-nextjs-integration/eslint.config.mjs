import baseConfig from "../../eslint.config.mjs";

export default [
    ...baseConfig,
    {
        rules: {
            // Disable the problematic rules for this app
            "@typescript-eslint/lines-between-class-members": "off",
            "@typescript-eslint/no-throw-literal": "off",
            "@typescript-eslint/ban-types": "off",
            "sonarjs/no-empty-function": "off",
            "sonarjs/no-unused-expressions": "off"
        }
    }
];
