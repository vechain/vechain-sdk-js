/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: '../../customEnv.js',
    setupFiles: ['./jest.browser-setup.js'],
    testPathIgnorePatterns: [
        'tests/utils/poll/event/event-poll.unit.test.ts',
        'http-client.testnet.test.ts'
    ],
    coverageReporters: ['html', 'lcov', 'json'],
    runner: 'groups',
    reporters: ['default', 'jest-junit'],
    workerThreads: true
};
