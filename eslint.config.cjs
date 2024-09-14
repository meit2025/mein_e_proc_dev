// eslint.config.cjs

const reactConfig = require('eslint-plugin-react/configs/recommended');
const prettierConfig = require('eslint-config-prettier');

// eslint.config.cjs

module.exports = [
  // React and JSX-A11Y configuration
  reactConfig,

  // Prettier configuration to disable ESLint rules that conflict with Prettier
  prettierConfig,

  // Custom rules and configurations
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2021, // Latest ECMAScript features
      sourceType: 'module', // Support for ECMAScript modules
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Enable JSX
        },
      },
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect React version
      },
    },
    plugins: {
      react: require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
      'jsx-a11y': require('eslint-plugin-jsx-a11y'),
      prettier: require('eslint-plugin-prettier'),
    },
    rules: {
      // React-specific rules
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Accessibility rules for JSX
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          assert: 'either',
        },
      ],

      // General best practices
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 1 }],
      quotes: ['error', 'single', { avoidEscape: false }],
      semi: ['error', 'always'],
      'prettier/prettier': ['error', { singleQuote: true, semi: true }],
    },
  },
];
