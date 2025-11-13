import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
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
    ignores: ["**/node_modules/", "**/dist/", "**/coverage/", "**/coverageUnit/", "**/jest.config.*", "**/eslint.config.mjs", "**/jest.browser-setup.js"],
}, ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
    "prettier",
    "plugin:sonarjs/recommended-legacy",
    "plugin:security/recommended-legacy",
), {
    files: ["**/src/**/*.ts", "**/tests/**/*.ts"],
    plugins: {
        "@typescript-eslint": typescriptEslint,
        "import": importPlugin,
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
            varsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_|^e$|^error$", // Allow common error variable names
        }],

        "@typescript-eslint/explicit-function-return-type": "warn", // Too strict, TypeScript infers types well
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "@typescript-eslint/prefer-nullish-coalescing": "warn", // Sometimes assignment is clearer
        "@typescript-eslint/prefer-optional-chain": "error",
        "@typescript-eslint/non-nullable-type-assertion-style": "off",
        "@typescript-eslint/no-invalid-void-type": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-throw-literal": "off",
        "@typescript-eslint/return-await": "off", // Disabled in SDK config
        "@typescript-eslint/no-useless-constructor": "off", // Too many false positives with super() calls
        "@typescript-eslint/no-empty-object-type": "off", // Empty interfaces can be useful for future extensions
        "@typescript-eslint/lines-between-class-members": "off",

        "prettier/prettier": ["error", {
            singleQuote: true,
            trailingComma: "none",
            tabWidth: 4,
        }],

        // Spacing and blank line rules to catch formatting issues
        "no-multiple-empty-lines": ["error", { 
            max: 1,
            maxEOF: 1,
            maxBOF: 0
        }],
        "no-trailing-spaces": "error",
        "eol-last": ["error", "always"],
        "no-irregular-whitespace": "error",
        "no-mixed-spaces-and-tabs": "error",

        "no-warning-comments": "warn",
        "no-multi-str": "off",
        
        // Standard.js style rules (replacing eslint-config-standard-with-typescript)
        "no-var": "error",
        "prefer-const": "error",
        "prefer-arrow-callback": "error",
        "arrow-spacing": "off", // Handled by Prettier
        "object-shorthand": "error",
        "prefer-template": "error",
        "template-curly-spacing": "off", // Handled by Prettier
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "no-useless-constructor": "off", // TypeScript handles this better, use @typescript-eslint version if needed
        "no-duplicate-imports": "off", // Too restrictive - considers imports from different submodules as duplicates
        "import/no-duplicates": "error", // Better rule that handles submodules correctly
        "no-useless-computed-key": "error",
        "no-useless-rename": "error",
        "rest-spread-spacing": "off", // Handled by Prettier
        // Formatting rules disabled - Prettier handles these
        "comma-dangle": "off", // Handled by Prettier
        "space-before-function-paren": "off", // Handled by Prettier
        "space-in-parens": "off", // Handled by Prettier
        "space-before-blocks": "off", // Handled by Prettier
        "keyword-spacing": "off", // Handled by Prettier
        "brace-style": "off", // Handled by Prettier
        "curly": ["error", "multi-line"],
        "eqeqeq": ["error", "always", { "null": "ignore" }],
        // Disable base ESLint rules that conflict with TypeScript versions
        "no-throw-literal": "off", // Use @typescript-eslint/no-throw-literal instead
        "prefer-promise-reject-errors": "error",
        "no-return-await": "off", // Use @typescript-eslint/return-await instead
        "require-await": "error",
        "no-async-promise-executor": "error",
        "no-await-in-loop": "warn", // Sometimes sequential processing is necessary
        "no-promise-executor-return": "error",
        "no-new": "off",
        "no-array-constructor": "error",
        "array-callback-return": ["error", { "allowImplicit": true }],
        "prefer-destructuring": ["error", {
            "array": false,
            "object": true
        }],
        "no-eval": "error",
        "no-implied-eval": "error",
        "no-new-func": "error",
        "no-script-url": "error",
        "no-iterator": "error",
        "no-restricted-syntax": ["error", "WithStatement"],
        "no-labels": ["error", { "allowLoop": false, "allowSwitch": false }],
        "no-lone-blocks": "error",
        "no-multi-assign": "error",
        "no-param-reassign": ["warn", {
            "props": true,
            "ignorePropertyModificationsFor": [
                "acc",
                "accumulator",
                "e",
                "ctx",
                "context",
                "req",
                "request",
                "res",
                "response",
                "$scope",
                "staticContext",
                "httpOptions",
                "baseURL",
                "entry",
                "obj",
                "sum",
                "segments"
            ]
        }],
        "no-return-assign": "error",
        "no-sequences": "error",
        "no-unmodified-loop-condition": "error",
        "no-unused-expressions": ["error", {
            "allowShortCircuit": true,
            "allowTernary": true,
            "allowTaggedTemplates": true
        }],
        "no-useless-call": "error",
        "no-useless-concat": "error",
        "no-useless-return": "error",
        "no-undef-init": "error",
        "no-use-before-define": "off", // TypeScript handles this with type checking, too many false positives
        "camelcase": ["error", {
            "properties": "never",
            "ignoreDestructuring": true,
            "ignoreImports": true, // External library imports like nc_utils, s_bip32
            "ignoreGlobals": false,
            "allow": ["^nc_", "^s_", "^nh_"] // Allow common external library prefixes
        }],
        "new-cap": ["error", {
            "newIsCap": true,
            "capIsNew": false,
            "properties": true
        }],
        "no-new-object": "error",
        "no-nested-ternary": "warn", // Sometimes acceptable for simple cases
        "no-unneeded-ternary": "error",
        "one-var": ["error", "never"],
        "operator-assignment": ["error", "always"],
        "spaced-comment": ["error", "always", {
            "line": {
                "markers": ["*package", "!", "/", ",", "="]
            },
            "block": {
                "balanced": true,
                "markers": ["*package", "!", ",", ":", "::", "flow-include"],
                "exceptions": ["*"]
            }
        }],
        "no-path-concat": "error",
        "no-process-env": "off",
        "no-process-exit": "off",
        "no-sync": "off",
        "func-name-matching": "error",
        "func-style": "off", // Too restrictive, function declarations are fine
        "no-inline-comments": "off",
        "no-negated-condition": "off",
        "no-undefined": "off",
        "prefer-named-capture-group": "off", // Not always necessary, can make regex less readable
        "yoda": "error",
        
        "local-rules/disallow-buffer-from-alloc": "error",
        "local-rules/disallow-instanceof-uint8array": "error",
        "sonarjs/different-types-comparison": "off",
        "sonarjs/no-ignored-exceptions": "off",
        "sonarjs/no-nested-functions": "off",
        "sonarjs/function-return-type": "off",
        "sonarjs/no-nested-conditional": "off",
        "sonarjs/cognitive-complexity": "off",
        "sonarjs/new-cap": "off",
        "sonarjs/no-empty-function": "off",
        "sonarjs/no-unused-expressions": "off",
        "sonarjs/deprecation": "off",
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