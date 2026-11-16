import prettierConfig from '@iobroker/eslint-config/prettier.config.mjs';

export default {
    ...prettierConfig,
    // uncomment next line if you prefer double quotes
    // singleQuote: false,
    overrides: [
        ...(prettierConfig.overrides ?? []),
        {
            files: ['*.json', '*.json5', '*.jsonc', '*.nycrc', '*.yml'],
            options: {
                tabWidth: 2,
            },
        },
    ],
};
