const { compilerOptions } = require('./tsconfig.json')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    roots: ['<rootDir>'],
    modulePaths: ['<rootDir>/src'],
    moduleNameMapper: {
        '^@thor$': '<rootDir>/src/thor/index.ts',
        '^@thor/(.*)$': '<rootDir>/src/thor/$1',
        '^@ws$': '<rootDir>/src/ws/index.ts',
        '^@ws/(.*)$': '<rootDir>/src/ws/$1',
        '^@http$': '<rootDir>/src/http/index.ts',
        '^@http/(.*)$': '<rootDir>/src/http/$1'
    },
    preset: 'ts-jest',
    testEnvironment: '../../customEnv.js',
    setupFiles: ['./jest.browser-setup.js'],
    // Add these options to improve module resolution in CI
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: {
                paths: compilerOptions.paths
            }
        }]
    },
    coverageReporters: ['html', 'lcov', 'json'],
    runner: 'groups',
    reporters: ['default', 'jest-junit'],
    workerThreads: true
};
