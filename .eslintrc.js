const plugins = ['@typescript-eslint', 'import', 'prettier'];
const extend = [
  'eslint:recommended',
  'prettier',
  'plugin:@typescript-eslint/recommended',
  'plugin:import/typescript',
];

const rules = {
  quotes: [2, 'single', { avoidEscape: true }],
  semi: [2, 'always'],
  'prettier/prettier': [
    'error',
    {
      semi: true,
      singleQuote: true,
    },
  ],
  '@typescript-eslint/no-var-requires': 'off',
  'import/prefer-default-export': 0,
};

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  rules,
  extends: extend,
  plugins,
};
