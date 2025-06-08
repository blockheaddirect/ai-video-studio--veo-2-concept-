// Explicitly specified paths to test files
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: './config/tsconfig.json', diagnostics: false }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['**/__TESTS__/tests/**/*.test.ts'],
};
