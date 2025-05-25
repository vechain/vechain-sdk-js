/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    testTimeout: 60000,
    maxWorkers: 3,
    preset: 'ts-jest',
    testEnvironment: '../../customEnv.js',
    setupFiles: ['./jest.browser-setup.js'],
    coverageReporters: ['html', 'lcov', 'json'],
    runner: 'groups',
    reporters: ['default', 'jest-junit'],
    workerThreads: true
};
