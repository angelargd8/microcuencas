export default {
  testEnvironment: 'node',
  transform: {},

  testMatch: [
    '**/__tests__/**/*.js',
    '**/*.test.js',
    '**/*.spec.js'
  ],

  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/'
  ],

  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/__tests__/',
    '/dist/'
  ],
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  verbose: true
};