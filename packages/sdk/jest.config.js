const { compilerOptions } = require('./tsconfig.json')

/** @type {import('ts-jest').JestConfigWithTsJest} */
const baseConfig = {
    roots: ['<rootDir>'],
    modulePaths: ['<rootDir>/src'],
    moduleNameMapper: {
        '^@common/(.*)$': '<rootDir>/src/common/$1',
        '^@thor/(.*)$': '<rootDir>/src/thor/$1',
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

// Enforce coverage thresholds only for UNIT runs.
// Integration/clients/browser are signal-only and shouldn't fail CI due to coverage.
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = process.env.UNIT
    ? {
          ...baseConfig,
          coverageThreshold: {
              global: {
                  branches: 40,
                  functions: 45,
                  lines: 80,
                  statements: 65
              }
          }
      }
    : baseConfig;
