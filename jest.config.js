module.exports = {
  moduleDirectories: ['node_modules'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.js?(x)',
    '<rootDir>/src/**/?(*.)(spec|test).js?(x)',
  ],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  collectCoverageFrom: ['src/**/*.js'],
  testEnvironment: 'jsdom',
  coverageDirectory: './coverage/',
  collectCoverage: true,
}
