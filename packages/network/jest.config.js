/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    globalSetup: '<rootDir>/jest.setup.ts',
    globalTeardown: '<rootDir>/jest.teardown.ts',
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageReporters: ['html', 'lcov', 'json'],
    runner: 'groups'
};
