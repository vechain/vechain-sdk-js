/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: '../../customEnv.js',
    setupFiles: ['./jest.browser-setup.js'],
    coverageReporters: ['html', 'lcov', 'json'],
    moduleNameMapper: {
        '^@common/(.*)$': '<rootDir>/src/common/$1',
        '^@common$': '<rootDir>/src/common',
        '^@thor/(.*)$': '<rootDir>/src/thor/$1',
        '^@thor$': '<rootDir>/src/thor',
        '^@viem/(.*)$': '<rootDir>/src/viem/$1',
        '^@viem$': '<rootDir>/src/viem',
    },
    runner: 'groups',
    reporters: ['default', 'jest-junit'],
    workerThreads: true
};
