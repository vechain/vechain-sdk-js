import baseConfig from "../../eslint.config.mjs";

export default [
    ...baseConfig,
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parserOptions: {
                project: "./tsconfig.json"
            }
        }
    }
];
