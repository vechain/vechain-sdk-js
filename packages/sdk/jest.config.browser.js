/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: '../../customEnv.js',
    setupFiles: ['./jest.browser-setup.js'],
    coverageReporters: ['html', 'lcov', 'json'],
    runner: 'groups',
    reporters: ['default', 'jest-junit'],
    workerThreads: true,
    modulePaths: ['<rootDir>/src'],
    moduleNameMapper: {
        '^@common$': '<rootDir>/src/common',
        '^@common/(.*)$': '<rootDir>/src/common/$1',
        '^@thor$': '<rootDir>/src/thor',
        '^@thor/(.*)$': '<rootDir>/src/thor/$1',
        '^@viem$': '<rootDir>/src/viem',
        '^@viem/(.*)$': '<rootDir>/src/viem/$1',
    }
};
