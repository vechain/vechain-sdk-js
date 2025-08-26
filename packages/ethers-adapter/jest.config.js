/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: '../../customEnv.js',
    coverageReporters: ['html', 'lcov', 'json'],
    runner: 'groups',
    reporters: ['default', 'jest-junit'],
    workerThreads: false,
    coverageThreshold: {
        global: {
            branches: 10,
            functions: 70,
            lines: 30,
            statements: 30
        }
    }
};
