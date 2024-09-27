/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageReporters: ['html', 'lcov', 'json'],
    runner: 'groups',
    reporters: ['default', 'jest-junit'],
    workerThreads: true,
    coverageThreshold: {
        global: {
            branches: 91,
            functions: 92,
            lines: 94,
            statements: 94
        }
    }
};
