import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        ".dev-server/*",
        "**/.prettierrc.js",
        "**/.eslintrc.js",
        "admin/words.js",
        "widgets/openligadb/js/clipboard-polyfill.promise.js",
        "widgets/openligadb/js/highlight.pack.js",
        "widgets/openligadb/js/jquery-3.2.1.min.js",
    ],
}, ...compat.extends("eslint:recommended"), {
    plugins: {},

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.mocha,
        },

        ecmaVersion: "latest",
        sourceType: "module",
    },

    rules: {
        indent: ["error", 4, {
            SwitchCase: 1,
        }],

        "no-console": "off",

        "no-unused-vars": ["error", {
            ignoreRestSiblings: true,
            argsIgnorePattern: "^_",
        }],

        "no-var": "error",
        "no-trailing-spaces": "error",
        "prefer-const": "error",

        quotes: ["error", "double", {
            avoidEscape: true,
            allowTemplateLiterals: true,
        }],

        semi: ["error", "always"],
    },
}];