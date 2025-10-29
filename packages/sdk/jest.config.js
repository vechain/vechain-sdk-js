const { compilerOptions } = require('./tsconfig.json')

/** @type {import('ts-jest').JestConfigWithTsJest} */
const baseConfig = {
    roots: ['<rootDir>'],
    modulePaths: ['<rootDir>/src'],
    moduleNameMapper: {
        '^@common$': '<rootDir>/src/common',
        '^@common/(.*)$': '<rootDir>/src/common/$1',
        '^@thor$': '<rootDir>/src/thor',
        '^@thor/(.*)$': '<rootDir>/src/thor/$1',
        '^@viem$': '<rootDir>/src/viem',
        '^@viem/(.*)$': '<rootDir>/src/viem/$1',
    },
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/jest.node-setup.js'],
    coverageReporters: ['html', 'lcov', 'json'],
    runner: 'groups',
    reporters: ['default', 'jest-junit'],
    workerThreads: true
};

// Optionally enforce code coverage thresholds
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = process.env.ENFORCE_COVERAGE
    ? {
          ...baseConfig,
          coverageThreshold: {
              global: {
                  branches: 40,
                  functions: 45,
                  lines: 72,
                  statements: 65
              }
          }
      }
    : baseConfig;
