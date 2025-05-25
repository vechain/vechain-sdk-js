/** @type {import('ts-jest').JestConfigWithTsJest} */

const { onlyFailures, testTimeout } = require('./jest.config.browser');

// Coverage threshold would apply to yarn test, not yarn test:unit
const applyCodeCoverageLimits = process.env.APPLYCODECOVLIMITS;

module.exports = {
    testTimeout: 60000,
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageReporters: ['html', 'lcov', 'json'],
    runner: 'groups',
    reporters: ['default', 'jest-junit'],
    maxWorkers: 3,
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
