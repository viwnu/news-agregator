/* eslint-env node */
module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'plugin:react/jsx-runtime',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react'],
    parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
        "ecmaFeatures": {
            "jsx": true
        },
    },
    root: true,
    
    
    "rules": {
        "@typescript-eslint/strict-boolean-expressions": [
            2,
            {
                "allowString" : false,
                "allowNumber" : false,
            }
        ],
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "quotes": ["warn", "single"],
        "no-var": ["error"],
        "eqeqeq": ["error"],
        "max-lines": ["warn", 200],
        "semi": ["warn", "never"],
        "arrow-spacing": "warn",
        "@typescript-eslint/consistent-type-definitions": ["warn", "type"]
    },
  };