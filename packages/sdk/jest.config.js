const { compilerOptions } = require('./tsconfig.json')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    roots: ['<rootDir>'],
    modulePaths: ['<rootDir>/src'],
    moduleNameMapper: {
        '^@common/(.*)$': '<rootDir>/src/common/$1',
        '^@common$': '<rootDir>/src/common',
        '^@thor/(.*)$': '<rootDir>/src/thor/$1',
        '^@thor$': '<rootDir>/src/thor',
        '^@viem/(.*)$': '<rootDir>/src/viem/$1',
        '^@viem$': '<rootDir>/src/viem',
    },
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageReporters: ['html', 'lcov', 'json'],
    runner: 'groups',
    reporters: ['default', 'jest-junit'],
    workerThreads: true,
    coverageThreshold: {
        global: {
            branches: 40,
            functions: 45,
            lines: 81,
            statements: 65
        }
    }
};
