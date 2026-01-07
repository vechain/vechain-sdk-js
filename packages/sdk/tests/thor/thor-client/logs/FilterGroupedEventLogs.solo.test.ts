import { Address, Hex, Revision } from '@common/vcdm';
import { describe, expect, test, beforeAll } from '@jest/globals';
import { PrivateKeySigner } from '@thor/signer';
import { Contract, EventLogFilter, ThorClient } from '@thor/thor-client';
import { ThorNetworks } from '@thor/utils';
import { getConfigData } from '@vechain/sdk-solo-setup';
import { Abi, AbiEvent, toEventSelector } from 'viem';

/**
 * @group solo
 */
describe('FilterEventLogs solo tests - events contract', () => {
    let thorClient: ThorClient;
    let eventContractAbi: Abi;
    let eventContractAddress: Address;
    let eventContract: Contract<Abi>;
    let bestBlockNumber: number;

    beforeAll(async () => {
        // create a thor client for solo
        thorClient = ThorClient.at(ThorNetworks.SOLONET);
        // load event contract details from solo config
        const soloConfig = getConfigData();
        eventContractAbi = soloConfig.EVENTS_CONTRACT_ABI as Abi;
        eventContractAddress = Address.of(soloConfig.EVENTS_CONTRACT_ADDRESS);
        // create a contract instance for the event contract
        eventContract = thorClient.contracts.load<Abi>(
            eventContractAddress,
            eventContractAbi
        );
        // get best block number
        const bestBlock = await thorClient.blocks.getBlock(Revision.BEST);
        if (!bestBlock) {
            throw new Error('Failed to get best block');
        }
        bestBlockNumber = bestBlock.number;
        // create a signer for triggering events
        const signer = new PrivateKeySigner(
            Hex.of(soloConfig.DEFAULT_SOLO_ACCOUNT_PRIVATE_KEYS[0]).bytes
        );
        eventContract.setSigner(signer);
    });
    test('ok <- FilterGroupedEventLogs', async () => {
        // need to emit several events with different signatures
        // emit several Notes events
        const notesWho = [
            Address.of('0x1234567890123456789012345678888888888888'),
            Address.of('0x1234567890123456789012345678888888888889'),
            Address.of('0x123456789012345678901234567888888888888A')
        ];
        const notesNote = [
            'Hello, world!',
            'Hello, world! 2',
            'Hello, world! 3'
        ];
        const notesTxIds = await Promise.all(
            notesWho.map((who, index) =>
                eventContract.transact.emitNote(
                    who.toString(),
                    notesNote[index]
                )
            )
        );
        await Promise.all(
            notesTxIds.map((txId) =>
                thorClient.transactions.waitForTransactionReceipt(txId)
            )
        );
        // emit a Transfer event
        const transferTo = Address.of(
            '0x123456789012345678901234567888888888888B'
        );
        const transferValue = 1000000000000000000n;
        const transferTxId = await eventContract.transact.emitTransfer(
            transferTo.toString(),
            transferValue
        );
        await thorClient.transactions.waitForTransactionReceipt(transferTxId);

        // get the note event abi
        const noteEventAbi = eventContractAbi.find(
            (abi) => abi.type === 'event' && abi.name === 'Note'
        ) as AbiEvent;
        if (!noteEventAbi) {
            throw new Error('Note event not found');
        }

        // get the transfer event abi
        const transferEventAbi = eventContractAbi.find(
            (abi) => abi.type === 'event' && abi.name === 'Transfer'
        ) as AbiEvent;
        if (!transferEventAbi) {
            throw new Error('Transfer event not found');
        }
        // create a filter for both Note and Transfer events
        const filter: EventLogFilter = {
            range: {
                unit: 'block',
                from: bestBlockNumber
            },
            criteriaSet: [
                {
                    address: eventContractAddress,
                    topic0: Hex.of(toEventSelector(noteEventAbi)),
                    topic1: notesWho[0]
                },
                {
                    address: eventContractAddress,
                    topic0: Hex.of(toEventSelector(noteEventAbi)),
                    topic1: notesWho[1]
                },
                {
                    address: eventContractAddress,
                    topic0: Hex.of(toEventSelector(noteEventAbi)),
                    topic1: notesWho[2]
                },
                {
                    address: eventContractAddress,
                    topic0: Hex.of(toEventSelector(transferEventAbi)),
                    topic1: eventContract.getSigner()?.address,
                    topic2: transferTo
                }
            ]
        };
        // filter the grouped event logs
        const logs = await thorClient.logs.filterGroupedEventLogs(filter, [
            noteEventAbi,
            transferEventAbi
        ]);
        // expect to be two groups
        expect(logs.length).toBe(2);
        // expect notes group to have 3 logs
        expect(logs[0].length).toBe(3);
        // expect transfer group to have 1 log
        expect(logs[1].length).toBe(1);
    });
    test('no event logs found', async () => {
        // get the note event abi
        const noteEventAbi = eventContractAbi.find(
            (abi) => abi.type === 'event' && abi.name === 'Note'
        ) as AbiEvent;
        if (!noteEventAbi) {
            throw new Error('Note event not found');
        }
        // filter the event logs with a topic1 filter that will not match any event logs
        const filter: EventLogFilter = {
            range: {
                unit: 'block',
                from: bestBlockNumber
            },
            criteriaSet: [
                {
                    address: eventContractAddress,
                    topic0: Hex.of(toEventSelector(noteEventAbi)),
                    topic1: Address.of(
                        '0x1122334455667788990011223344556677889900'
                    )
                }
            ]
        };
        const logs = await thorClient.logs.filterGroupedEventLogs(filter, [
            noteEventAbi
        ]);
        expect(logs).toBeDefined();
        expect(logs.length).toBe(0);
    });
});
