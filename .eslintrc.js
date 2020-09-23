module.exports = {
  env: {
    browser: true,
  },
  extends: [
    '@noliaki/eslint-config-typescript-prettier',
    'plugin:react/recommended',
  ],
  ignorePatterns: ['next.config.js'],
}
