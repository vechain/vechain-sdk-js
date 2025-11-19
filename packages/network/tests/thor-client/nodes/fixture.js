"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockWithInvalidTimeStampFormat = exports.blockWithMissingTimeStamp = exports.blockWithOldTimeStamp = void 0;
/**
 * @internal
 * Block with a timestamp much older than the current time
 */
const blockWithOldTimeStamp = {
    number: 16935885,
    id: '0x01026bcde286e4c5b55507477edc666bb79b41ea97b6e78d65726fe557131533',
    size: 361,
    parentID: '0x01026bcc5214fdc936b9afd15460479dfe35972219f78f322e23cc8184a035ab',
    timestamp: 16993933000,
    gasLimit: 30000000,
    beneficiary: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
    gasUsed: 0,
    totalScore: 131653862,
    txsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    txsFeatures: 1,
    stateRoot: '0x0b43423ced22d182d73728e47fef395169bff38c725dfdb84589e3cedfad2db2',
    receiptsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    com: true,
    signer: '0xd6fab81fd54b989655b42d51b0344ddcb5007a5a',
    isTrunk: true,
    isFinalized: false,
    transactions: []
};
exports.blockWithOldTimeStamp = blockWithOldTimeStamp;
/**
 * @internal
 * Block with a missing timestamp
 */
const blockWithMissingTimeStamp = {
    number: 16935885,
    id: '0x01026bcde286e4c5b55507477edc666bb79b41ea97b6e78d65726fe557131533',
    size: 361,
    parentID: '0x01026bcc5214fdc936b9afd15460479dfe35972219f78f322e23cc8184a035ab',
    gasLimit: 30000000,
    beneficiary: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
    gasUsed: 0,
    totalScore: 131653862,
    txsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    txsFeatures: 1,
    stateRoot: '0x0b43423ced22d182d73728e47fef395169bff38c725dfdb84589e3cedfad2db2',
    receiptsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    com: true,
    signer: '0xd6fab81fd54b989655b42d51b0344ddcb5007a5a',
    isTrunk: true,
    isFinalized: false,
    transactions: []
};
exports.blockWithMissingTimeStamp = blockWithMissingTimeStamp;
/**
 * @internal
 * Block with an invalid timestamp format
 */
const blockWithInvalidTimeStampFormat = {
    number: 16935885,
    id: '0x01026bcde286e4c5b55507477edc666bb79b41ea97b6e78d65726fe557131533',
    size: 361,
    parentID: '0x01026bcc5214fdc936b9afd15460479dfe35972219f78f322e23cc8184a035ab',
    timestamp: 'bad timestamp type',
    gasLimit: 30000000,
    beneficiary: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
    gasUsed: 0,
    totalScore: 131653862,
    txsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    txsFeatures: 1,
    stateRoot: '0x0b43423ced22d182d73728e47fef395169bff38c725dfdb84589e3cedfad2db2',
    receiptsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    com: true,
    signer: '0xd6fab81fd54b989655b42d51b0344ddcb5007a5a',
    isTrunk: true,
    isFinalized: false,
    transactions: []
};
exports.blockWithInvalidTimeStampFormat = blockWithInvalidTimeStampFormat;
