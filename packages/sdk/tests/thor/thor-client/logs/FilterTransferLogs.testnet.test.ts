import { describe, expect, test } from '@jest/globals';
import { ThorClient } from '@thor/thor-client';
import { ThorNetworks } from '@thor/utils';

/**
 * @group mainnet
 */
describe('FilterTransferLogs mainnet tests', () => {
    test('ok <- same filter as thor docs example', async () => {
        const thorClient = ThorClient.at(ThorNetworks.MAINNET);
        const transferLogs = await thorClient.logs.filterTransferLogs({
            range: {
                unit: 'block',
                from: 17240365,
                to: 17289864
            },
            options: {
                offset: 0,
                limit: 100,
                includeIndexes: true
            },
            criteriaSet: [
                {
                    txOrigin: '0x6d95e6dca01d109882fe1726a2fb9865fa41e7aa',
                    sender: '0x6d95e6dca01d109882fe1726a2fb9865fa41e7aa',
                    recipient: '0x45429a2255e7248e57fce99e7239aed3f84b7a53'
                }
            ],
            order: 'asc'
        });
        expect(transferLogs).toBeDefined();
        expect(transferLogs.length).toBeGreaterThan(0);
        expect(transferLogs[0].sender.toString().toLowerCase()).toBe(
            '0x6d95e6dca01d109882fe1726a2fb9865fa41e7aa'.toLowerCase()
        );
        expect(transferLogs[0].recipient.toString().toLowerCase()).toBe(
            '0x45429a2255e7248e57fce99e7239aed3f84b7a53'.toLowerCase()
        );
        expect('0x' + transferLogs[0].amount.toString(16).toLowerCase()).toBe(
            '0x921af8386350000'
        );
        expect(transferLogs[0].meta.blockNumber).toBe(17240382);
        expect(transferLogs[0].meta.txID.toString().toLowerCase()).toBe(
            '0x1ba0bf5965b3a09b83f54dc9ddf85bbcf2c22efee3773ebd2e702fe182a02f30'.toLowerCase()
        );
        expect(transferLogs[0].meta.txIndex).toBe(1);
        expect(transferLogs[0].meta.logIndex).toBe(2);
    });
    test('ok <- filter from stackblitz example', async () => {
        const thorClient = ThorClient.at(ThorNetworks.MAINNET);
        const transferLogs = await thorClient.logs.filterTransferLogs({
            range: {
                unit: 'block',
                from: 0,
                to: undefined
            },
            options: {
                offset: 0,
                limit: 1000
            },
            criteriaSet: [
                {
                    // VET receiver
                    recipient: '0x000000000000000000000000000000000000dead',
                    // transaction signer/origin
                    txOrigin: '0x19135a7c5c51950b3aa4b8de5076dd7e5fb630d4',
                    // VET sender
                    sender: '0x19135a7c5c51950b3aa4b8de5076dd7e5fb630d4'
                }
            ],
            order: 'asc'
        });
        expect(transferLogs).toBeDefined();
        expect(transferLogs.length).toBeGreaterThanOrEqual(2);
        expect(transferLogs[0].sender.toString().toLowerCase()).toBe(
            '0x19135a7c5c51950b3aa4b8de5076dd7e5fb630d4'.toLowerCase()
        );
        expect(transferLogs[0].recipient.toString().toLowerCase()).toBe(
            '0x000000000000000000000000000000000000dead'.toLowerCase()
        );
        expect(transferLogs[1].sender.toString().toLowerCase()).toBe(
            '0x19135a7c5c51950b3aa4b8de5076dd7e5fb630d4'.toLowerCase()
        );
        expect(transferLogs[1].recipient.toString().toLowerCase()).toBe(
            '0x000000000000000000000000000000000000dead'.toLowerCase()
        );
        expect(transferLogs[0].meta.txID.toString().toLowerCase()).toBe(
            '0xdea6e023f63f4322133d8f39c7eaf8273ca38cd498be03cd05f7e42641daa2a3'.toLowerCase()
        );
        expect(transferLogs[1].meta.txID.toString().toLowerCase()).toBe(
            '0x8d2c289bd6b5e1416b5849d7d7feb0994ddb2018b53539733242c42590254049'.toLowerCase()
        );
    });
});
