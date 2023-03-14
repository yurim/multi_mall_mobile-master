module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    'airbnb-base',
    'plugin:vue/base',
  ],
  plugins: [
  ],
  rules: {
    'max-len': 'off',
    'no-param-reassign': 'off',
    'no-console': 'off',
    'object-curly-newline': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-return-await': 'off',
    'consistent-return': 'off',
    'no-underscore-dangle': 'off',
    'no-shadow': ['error', { allow: ['state'] }],
    'prefer-destructuring': ['error', { object: false, array: false }],
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never',
    }],
  },
  settings: {
    'import/core-modules': ['vue', 'vuex'], // these modules are included in nuxt.js
    'import/resolver': {
      webpack: 'webpack.config.js',
    },
  },
};
