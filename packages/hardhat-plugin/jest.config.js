/** @type {import('ts-jest').JestConfigWithTsJest} */
// Coverage threshold would apply to yarn test, not yarn test:unit
const isUnitTest = process.env.UNIT;

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageReporters: ['html', 'lcov', 'json'],
    runner: 'groups',
    reporters: ['default', 'jest-junit'],
    coveragePathIgnorePatterns: [
        "/dist/",
        "/tests/"
    ],
    coverageThreshold:
        isUnitTest !== 'true'
            ? {
                  global: {
                      branches: 100,
                      functions: 100,
                      lines: 100,
                      statements: 100
                  }
              }
            : undefined
};
