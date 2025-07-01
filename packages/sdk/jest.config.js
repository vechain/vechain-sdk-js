const { compilerOptions } = require('./tsconfig.json')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    roots: ['<rootDir>'],
    modulePaths: ['<rootDir>/src'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@vcdm$': '<rootDir>/src/vcdm',
        '^@vcdm/(.*)$': '<rootDir>/src/vcdm/$1',
        '^@errors$': '<rootDir>/src/errors',
        '^@errors/(.*)$': '<rootDir>/src/errors/$1',
        '^@utils$': '<rootDir>/src/utils',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@secp256k1$': '<rootDir>/src/secp256k1',
        '^@secp256k1/(.*)$': '<rootDir>/src/secp256k1/$1',
        '^@transaction$': '<rootDir>/src/transaction',
        '^@transaction/(.*)$': '<rootDir>/src/transaction/$1',
        '^@certificate$': '<rootDir>/src/certificate',
        '^@certificate/(.*)$': '<rootDir>/src/certificate/$1',
        '^@hdkey$': '<rootDir>/src/hdkey',
        '^@hdkey/(.*)$': '<rootDir>/src/hdkey/$1',
        '^@keystore$': '<rootDir>/src/keystore',
        '^@keystore/(.*)$': '<rootDir>/src/keystore/$1',
        '@thor/(.*)': '<rootDir>/src/thor/$1',
        '@thor': '<rootDir>/src/thor',
        '@ws/(.*)': '<rootDir>/src/ws/$1',
        '@ws': '<rootDir>/src/ws',
        '@http/(.*)': '<rootDir>/src/http/$1',
        '@http': '<rootDir>/src/http'
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
            lines: 90,
            statements: 65
        }
    }
};
