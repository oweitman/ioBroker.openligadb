import globals from "globals";

export default [{
    languageOptions: {
        globals: {
            ...globals.browser,
        },
    },

    rules: {
        "no-var": "off",

        "no-unused-vars": ["warn", {
            ignoreRestSiblings: true,
            argsIgnorePattern: "^_",
        }],
    },
}];