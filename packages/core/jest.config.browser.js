const { compilerOptions } = require('./tsconfig.json')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    roots: ['<rootDir>'],
    modulePaths: ['<rootDir>/src'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@vcdm$': '<rootDir>/src/vcdm/index.ts',
        '^@vcdm/(.*)$': '<rootDir>/src/vcdm/$1',
        '^@errors$': '<rootDir>/src/errors/index.ts',
        '^@errors/(.*)$': '<rootDir>/src/errors/$1',
        '^@utils$': '<rootDir>/src/utils/index.ts',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@secp256k1$': '<rootDir>/src/secp256k1/index.ts',
        '^@secp256k1/(.*)$': '<rootDir>/src/secp256k1/$1',
        '^@transaction$': '<rootDir>/src/transaction/index.ts',
        '^@transaction/(.*)$': '<rootDir>/src/transaction/$1',
        '^@certificate$': '<rootDir>/src/certificate/index.ts',
        '^@certificate/(.*)$': '<rootDir>/src/certificate/$1',
        '^@hdkey$': '<rootDir>/src/hdkey/index.ts',
        '^@hdkey/(.*)$': '<rootDir>/src/hdkey/$1',
        '^@keystore$': '<rootDir>/src/keystore/index.ts',
        '^@keystore/(.*)$': '<rootDir>/src/keystore/$1',
        '^@cryptography$': '<rootDir>/src/keystore/cryptography/index.ts',
        '^@cryptography/(.*)$': '<rootDir>/src/keystore/cryptography/$1'
    },
    preset: 'ts-jest',
    testEnvironment: '../../customEnv.js',
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
