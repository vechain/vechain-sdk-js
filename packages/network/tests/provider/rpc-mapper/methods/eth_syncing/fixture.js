"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockedOutOfSyncBestBlockFixture = exports.mockedNotOutOfSyncBestBlockFixture = void 0;
/**
 * Mocked latest block fixture.
 * This to be sure that the block is not out of sync in time at 100%
 */
const mockedNotOutOfSyncBestBlockFixture = {
    number: 99999999,
    id: '0x0000000000000ffe671fae58993e0b3f465a7900000000000000000000000000',
    size: 361,
    parentID: '0x0000000000000ffe671fae58993e0b3f465a7900000000000000000000000000',
    timestamp: Math.floor(Date.now() / 1000),
    gasLimit: 30000000,
    beneficiary: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
    gasUsed: 0,
    totalScore: 142611716,
    txsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    txsFeatures: 1,
    stateRoot: '0x57443f25e3c4ade0ba9351bb19774563367e843e28c057b509fcf5edca45dd39',
    receiptsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    com: true,
    signer: '0xd848c998a36c05a0afe48f0e6bfa40232a94fd9b',
    isTrunk: true,
    isFinalized: false,
    transactions: []
};
exports.mockedNotOutOfSyncBestBlockFixture = mockedNotOutOfSyncBestBlockFixture;
/**
 * Mocked latest block fixture.
 * This to be sure that the block is out of sync in time at 100%
 */
const mockedOutOfSyncBestBlockFixture = {
    number: 99999999,
    id: '0x0000000000000ffe671fae58993e0b3f465a7900000000000000000000000000',
    size: 361,
    parentID: '0x0000000000000ffe671fae58993e0b3f465a7900000000000000000000000000',
    timestamp: Math.floor(Date.now() / 1000) - 20000,
    gasLimit: 30000000,
    beneficiary: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
    gasUsed: 0,
    totalScore: 142611716,
    txsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    txsFeatures: 1,
    stateRoot: '0x57443f25e3c4ade0ba9351bb19774563367e843e28c057b509fcf5edca45dd39',
    receiptsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    com: true,
    signer: '0xd848c998a36c05a0afe48f0e6bfa40232a94fd9b',
    isTrunk: true,
    isFinalized: false,
    transactions: []
};
exports.mockedOutOfSyncBestBlockFixture = mockedOutOfSyncBestBlockFixture;
