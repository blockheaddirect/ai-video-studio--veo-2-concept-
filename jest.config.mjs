export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(\@ffmpeg)/)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['<rootDir>/__TESTS__/tests/**/*.test.ts'],
  globals: {
    'ts-jest': {
      tsconfig: {
        target: 'ES2020',
      },
    },
  },
};
