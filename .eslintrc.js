module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            globalReturn: false,
            impliedStrict: true,
        },
    },
    rules: {
        'prettier/prettier': 'error',
        'default-case': 0,
        // TODO discuss removing these rules
        'no-prototype-builtins': 0,
        'no-nested-ternary': 0,
        'id-blacklist': 0,
        'class-methods-use-this': 0,
        // https://github.com/typescript-eslint/typescript-eslint/issues/342
        'no-undef': 0,
        'no-unused-vars': 0,
        'max-params': 0,
        'max-nested-callbacks': 0,
        camelcase: 0,
        'default-case': 0,
    },
};
