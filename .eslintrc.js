module.exports = {
  env: {
    browser: true,
    es2021 : true,
    node   : true,
    jest   : true,
  },
  extends: [
    'plugin:react/recommended',
    'standard',
    'plugin:react/jsx-runtime',
  ],
  parser       : '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType : 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  ignorePatterns: ['packages/**/lib/**/*'],
  rules         : {
    'comma-dangle'                   : ['error', 'always-multiline'],
    'array-element-newline'          : ['error', 'consistent'],
    'array-bracket-newline'          : ['error', { multiline: true }],
    'function-paren-newline'         : ['error', 'multiline-arguments'],
    // 'max-len'                        : ['error', { code: 80 }],
    'newline-per-chained-call'       : ['error', { ignoreChainWithDepth: 1 }],
    'key-spacing'                    : ['error', { align: 'colon' }],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev     : ['const', 'let', 'var'],
        next     : '*',
      },
      {
        blankLine: 'any',
        prev     : ['const', 'let', 'var'],
        next     : ['const', 'let', 'var'],
      },
    ],
  },
}
