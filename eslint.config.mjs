import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import localRules from "eslint-plugin-local-rules";
import sonarjs from "eslint-plugin-sonarjs";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/node_modules/", "**/dist/", "**/coverage/", "**/coverageUnit/", "**/jest.config.*", "**/eslint.config.mjs", "**/jest.browser-setup.js", "**/jest.global-setup.js"],
}, ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
    "standard-with-typescript",
    "prettier",
    "plugin:sonarjs/recommended-legacy",
    "plugin:security/recommended-legacy",
), {
    files: ["**/src/**/*.ts", "**/tests/**/*.ts"],
    plugins: {
        "@typescript-eslint": typescriptEslint,
        "local-rules": localRules,
        sonarjs,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.commonjs,
        },

        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "script",

        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    rules: {
        "@typescript-eslint/no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
        }],

        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "@typescript-eslint/prefer-nullish-coalescing": "error",
        "@typescript-eslint/prefer-optional-chain": "error",
        "@typescript-eslint/non-nullable-type-assertion-style": "off",
        "@typescript-eslint/no-invalid-void-type": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-throw-literal": "off",
        "@typescript-eslint/lines-between-class-members": "off",

        "prettier/prettier": ["error", {
            singleQuote: true,
            trailingComma: "none",
            tabWidth: 4,
        }],

        "no-warning-comments": "warn",
        "no-multi-str": "off",
        "local-rules/disallow-buffer-from-alloc": "error",
        "local-rules/disallow-instanceof-uint8array": "error",
        "sonarjs/different-types-comparison": "off",
        "sonarjs/no-ignored-exceptions": "off",
        "sonarjs/no-nested-functions": "off",
        "sonarjs/function-return-type": "off",
        "sonarjs/no-nested-conditional": "off",
        "sonarjs/cognitive-complexity": "off",
        "sonarjs/new-cap": "off",
        "security/detect-object-injection": "off",
        "security/detect-unsafe-regex": "off",
        "security/detect-non-literal-fs-filename": "off",
        "sonarjs/sonar-no-unused-vars": "off",
        "sonarjs/sonar-no-fallthrough": "off",
        "import/no-extraneous-dependencies": ["error", {"devDependencies": false, "optionalDependencies": false, "peerDependencies": false}]
    }
}, {
    files: ["**/tests/**/*.ts"],
    rules: {
        "import/no-extraneous-dependencies": "off",
    }
}];