/** @type {import('ts-jest').JestConfigWithTsJest} */
// Coverage threshold would apply to yarn test, not yarn test:unit
const applyCodeCoverageLimits = process.env.APPLYCODECOVLIMITS;

module.exports = {
    globalSetup: '<rootDir>/jest.global-setup.js',
    globalTeardown: '<rootDir>/jest.global-setup.js',
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageReporters: ['html', 'lcov', 'json'],
    runner: 'groups',
    reporters: ['default', 'jest-junit'],
    maxWorkers: process.env.CI ? 1 : 5,
    // Add cleanup options to prevent hanging
    forceExit: true,
    detectOpenHandles: true,
    testTimeout: 120000,
    coveragePathIgnorePatterns: [
        "/dist/",
        "/tests/"
    ],
    coverageThreshold:
        applyCodeCoverageLimits == 'true'
            ? {
                  global: {
                      branches: 90,
                      functions: 90,
                      lines: 90,
                      statements: 90
                  }
              }
            : undefined
};