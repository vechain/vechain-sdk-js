import { Address, Hex, HexUInt, Revision } from '@common/vcdm';
import { describe, expect, test, beforeAll } from '@jest/globals';
import { PrivateKeySigner } from '@thor/signer';
import { Contract, EventLogFilter, ThorClient } from '@thor/thor-client';
import { ThorNetworks } from '@thor/utils';
import { getConfigData } from '@vechain/sdk-solo-setup';
import {
    Abi,
    AbiEvent,
    AbiFunction,
    encodeAbiParameters,
    toEventSelector
} from 'viem';

/**
 * @group solo
 */
describe('FilterEventLogs solo tests', () => {
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

    test('ok <- Transfer event', async () => {
        // call the emit transfer function to emit a transfer event
        const txId = await eventContract.transact.emitTransfer(
            '0x1234567890123456789012345678901234567890',
            1000000000000000000
        );
        await thorClient.transactions.waitForTransactionReceipt(txId);
        // get the transfer event abi
        const transferEventAbi = eventContractAbi.find(
            (abi) => abi.type === 'event' && abi.name === 'Transfer'
        ) as AbiEvent;
        if (!transferEventAbi) {
            throw new Error('Transfer event not found');
        }
        // filter the transfer event
        const filter: EventLogFilter = {
            range: {
                unit: 'block',
                from: bestBlockNumber
            },
            criteriaSet: [
                {
                    address: eventContractAddress,
                    topic0: Hex.of(toEventSelector(transferEventAbi)),
                    topic1: eventContract.getSigner()?.address,
                    topic2: Address.of(
                        '0x1234567890123456789012345678901234567890'
                    )
                }
            ]
        };
        const logs = await thorClient.logs.filterEventLogs(filter, [
            transferEventAbi
        ]);
        expect(logs).toBeDefined();
        expect(logs.length).toBe(1);
        // check the event log
        expect(logs[0].eventLog.address.toString().toLowerCase()).toBe(
            eventContractAddress.toString().toLowerCase()
        );
        expect(logs[0].eventLog.topics[0].toString().toLowerCase()).toBe(
            toEventSelector(transferEventAbi).toLowerCase()
        );
        expect(logs[0].eventLog.topics[1].toString().toLowerCase()).toBe(
            eventContract.getSigner()?.address.toPaddedString(64).toLowerCase()
        );
        expect(logs[0].eventLog.topics[2].toString().toLowerCase()).toBe(
            Address.of('0x1234567890123456789012345678901234567890')
                .toPaddedString(64)
                .toLowerCase()
        );
        expect(logs[0].eventLog.data.toString().toLowerCase()).toBe(
            HexUInt.of(1000000000000000000).toPaddedString(64).toLowerCase()
        );
        // check the decoded data
        expect(logs[0].decodedData).toBeDefined();
        expect(logs[0].decodedData?.eventName).toBe('Transfer');
        const decodedFrom = logs[0].decodedData?.args.from as string;
        const decodedTo = logs[0].decodedData?.args.to as string;
        const decodedValue = logs[0].decodedData?.args.value as string;
        expect(decodedFrom.toLowerCase()).toBe(
            eventContract.getSigner()?.address.toString().toLowerCase()
        );
        expect(decodedTo.toLowerCase()).toBe(
            Address.of('0x1234567890123456789012345678901234567890')
                .toString()
                .toLowerCase()
        );
        expect(BigInt(decodedValue)).toBe(1000000000000000000n);
    });
    test('ok <- Payment event', async () => {
        // call the emit payment function to emit a payment event
        const amount = 1000000000000000000n;
        const memoHash = Hex.of('0x111111111111111111111111111111');
        const metadata = Hex.of('0x222222222222222222222222222222');
        const txId = await eventContract.transact.emitPayment(
            amount,
            memoHash.toPaddedString(64),
            metadata.toString()
        );
        await thorClient.transactions.waitForTransactionReceipt(txId);
        // get the payment event abi
        const paymentEventAbi = eventContractAbi.find(
            (abi) => abi.type === 'event' && abi.name === 'Payment'
        ) as AbiEvent;
        if (!paymentEventAbi) {
            throw new Error('Payment event not found');
        }
        // get the emit payment function abi
        const emitPaymentEvent = eventContract.abi.find(
            (abi) => abi.type === 'function' && abi.name === 'emitPayment'
        ) as AbiFunction;
        if (!emitPaymentEvent) {
            throw new Error('Emit payment function not found');
        }
        // get the encoded function data
        const emitPaymentEventData = encodeAbiParameters(
            emitPaymentEvent.inputs,
            [amount, memoHash.toPaddedString(64), metadata.toString()]
        );
        // filter the payment event
        const filter: EventLogFilter = {
            range: {
                unit: 'block',
                from: bestBlockNumber
            },
            criteriaSet: [
                {
                    address: eventContractAddress,
                    topic0: Hex.of(toEventSelector(paymentEventAbi)),
                    topic1: eventContract.getSigner()?.address
                }
            ]
        };
        const logs = await thorClient.logs.filterEventLogs(filter, [
            paymentEventAbi
        ]);
        expect(logs).toBeDefined();
        expect(logs.length).toBe(1);
        // check the event log
        expect(logs[0].eventLog.address.toString().toLowerCase()).toBe(
            eventContractAddress.toString().toLowerCase()
        );
        expect(logs[0].eventLog.topics[0].toString().toLowerCase()).toBe(
            toEventSelector(paymentEventAbi).toLowerCase()
        );
        expect(logs[0].eventLog.topics[1].toString().toLowerCase()).toBe(
            eventContract.getSigner()?.address.toPaddedString(64).toLowerCase()
        );
        expect(logs[0].eventLog.data.toString().toLowerCase()).toBe(
            emitPaymentEventData.toLowerCase()
        );
        // check the decoded data
        expect(logs[0].decodedData).toBeDefined();
        expect(logs[0].decodedData?.eventName).toBe('Payment');
        const decodedPayer = logs[0].decodedData?.args.payer as string;
        const decodedAmount = logs[0].decodedData?.args.amount as string;
        const decodedMemoHash = logs[0].decodedData?.args.memoHash as string;
        const decodedMetadata = logs[0].decodedData?.args.metadata as string;
        expect(decodedPayer.toLowerCase()).toBe(
            eventContract.getSigner()?.address.toString().toLowerCase()
        );
        expect(BigInt(decodedAmount)).toBe(amount);
        expect(decodedMemoHash.toLowerCase()).toBe(
            memoHash.toPaddedString(64).toLowerCase()
        );
        expect(decodedMetadata.toLowerCase()).toBe(
            metadata.toString().toLowerCase()
        );
    });
    test('ok <- Note event', async () => {
        // call the emit note function to emit a note event
        const who = Address.of('0x1234567890123456789012345678901234567890');
        const note = 'Hello, world!';
        const txId = await eventContract.transact.emitNote(
            who.toString(),
            note
        );
        await thorClient.transactions.waitForTransactionReceipt(txId);
        // get the note event abi
        const noteEventAbi = eventContractAbi.find(
            (abi) => abi.type === 'event' && abi.name === 'Note'
        ) as AbiEvent;
        if (!noteEventAbi) {
            throw new Error('Note event not found');
        }
        // filter the note event
        const filter: EventLogFilter = {
            range: {
                unit: 'block',
                from: bestBlockNumber
            },
            criteriaSet: [
                {
                    address: eventContractAddress,
                    topic0: Hex.of(toEventSelector(noteEventAbi)),
                    topic1: who
                }
            ]
        };
        const logs = await thorClient.logs.filterEventLogs(filter, [
            noteEventAbi
        ]);
        expect(logs).toBeDefined();
        expect(logs.length).toBe(1);
        // check the event log
        expect(logs[0].eventLog.address.toString().toLowerCase()).toBe(
            eventContractAddress.toString().toLowerCase()
        );
        expect(logs[0].eventLog.topics[0].toString().toLowerCase()).toBe(
            toEventSelector(noteEventAbi).toLowerCase()
        );
        expect(logs[0].eventLog.topics[1].toString().toLowerCase()).toBe(
            who.toPaddedString(64).toLowerCase()
        );
        const expectedData = encodeAbiParameters([{ type: 'string' }], [note]);
        expect(logs[0].eventLog.data.toString().toLowerCase()).toBe(
            expectedData.toLowerCase()
        );
        // check the decoded data
        expect(logs[0].decodedData).toBeDefined();
        expect(logs[0].decodedData?.eventName).toBe('Note');
        const decodedWho = logs[0].decodedData?.args.who as string;
        const decodedNote = logs[0].decodedData?.args.note as string;
        expect(decodedWho.toLowerCase()).toBe(who.toString().toLowerCase());
        expect(decodedNote.toLowerCase()).toBe(note.toLowerCase());
    });
    test('ok <- Batch event', async () => {
        // call the emit batch function to emit a batch event
        const recipients = [
            '0x1234567890123456789012345678901234567890',
            '0x1234567890123456789012345678901234567891'
        ];
        const amounts = [1000000000000000000n, 2000000000000000000n];
        const txId = await eventContract.transact.emitBatch(
            recipients,
            amounts
        );
        await thorClient.transactions.waitForTransactionReceipt(txId);
        // get the batch event abi
        const batchEventAbi = eventContractAbi.find(
            (abi) => abi.type === 'event' && abi.name === 'Batch'
        ) as AbiEvent;
        if (!batchEventAbi) {
            throw new Error('Batch event not found');
        }
        // filter the batch event
        const filter: EventLogFilter = {
            range: {
                unit: 'block',
                from: bestBlockNumber
            },
            criteriaSet: [
                {
                    address: eventContractAddress,
                    topic0: Hex.of(toEventSelector(batchEventAbi)),
                    topic1: eventContract.getSigner()?.address
                }
            ]
        };
        const logs = await thorClient.logs.filterEventLogs(filter, [
            batchEventAbi
        ]);
        expect(logs).toBeDefined();
        expect(logs.length).toBe(1);
        // check the event log
        expect(logs[0].eventLog.address.toString().toLowerCase()).toBe(
            eventContractAddress.toString().toLowerCase()
        );
        expect(logs[0].eventLog.topics[0].toString().toLowerCase()).toBe(
            toEventSelector(batchEventAbi).toLowerCase()
        );
        expect(logs[0].eventLog.topics[1].toString().toLowerCase()).toBe(
            eventContract.getSigner()?.address.toPaddedString(64).toLowerCase()
        );
        const expectedData = encodeAbiParameters(
            [{ type: 'address[]' }, { type: 'uint256[]' }],
            [recipients, amounts]
        );
        expect(logs[0].eventLog.data.toString().toLowerCase()).toBe(
            expectedData.toLowerCase()
        );
        // check the decoded data
        expect(logs[0].decodedData).toBeDefined();
        expect(logs[0].decodedData?.eventName).toBe('Batch');
        const decodedRecipients = logs[0].decodedData?.args
            .recipients as string[];
        const decodedAmounts = logs[0].decodedData?.args.amounts as string[];
        expect(decodedRecipients.length).toBe(recipients.length);
        expect(decodedAmounts.length).toBe(amounts.length);
        for (let i = 0; i < recipients.length; i++) {
            expect(decodedRecipients[i].toLowerCase()).toBe(
                recipients[i].toLowerCase()
            );
            expect(BigInt(decodedAmounts[i])).toBe(amounts[i]);
        }
    });
    test('ok <- DataOnly event', async () => {
        // call the emit data only function to emit a data only event
        const payload = Hex.of('0x1111111111111111111111111111111111111111');
        const number = 1000000000000000000n;
        const tag = 'Hello, world!';
        const txId = await eventContract.transact.emitDataOnly(
            tag,
            payload.toString(),
            number
        );
        await thorClient.transactions.waitForTransactionReceipt(txId);
        // get the data only event abi
        const dataOnlyEventAbi = eventContractAbi.find(
            (abi) => abi.type === 'event' && abi.name === 'DataOnly'
        ) as AbiEvent;
        if (!dataOnlyEventAbi) {
            throw new Error('DataOnly event not found');
        }
        // filter the data only event
        // no indexed params, so only topic0 is used
        const filter: EventLogFilter = {
            range: {
                unit: 'block',
                from: bestBlockNumber
            },
            criteriaSet: [
                {
                    address: eventContractAddress,
                    topic0: Hex.of(toEventSelector(dataOnlyEventAbi))
                }
            ]
        };
        const logs = await thorClient.logs.filterEventLogs(filter, [
            dataOnlyEventAbi
        ]);
        expect(logs).toBeDefined();
        expect(logs.length).toBe(1);
        // check the event log
        expect(logs[0].eventLog.address.toString().toLowerCase()).toBe(
            eventContractAddress.toString().toLowerCase()
        );
        expect(logs[0].eventLog.topics[0].toString().toLowerCase()).toBe(
            toEventSelector(dataOnlyEventAbi).toLowerCase()
        );
        const expectedData = encodeAbiParameters(dataOnlyEventAbi.inputs, [
            tag,
            payload.toString(),
            number
        ]);
        expect(logs[0].eventLog.data.toString().toLowerCase()).toBe(
            expectedData.toLowerCase()
        );
        // check the decoded data
        expect(logs[0].decodedData).toBeDefined();
        expect(logs[0].decodedData?.eventName).toBe('DataOnly');
        const decodedTag = logs[0].decodedData?.args.tag as string;
        const decodedPayload = logs[0].decodedData?.args.payload as string;
        const decodedNumber = BigInt(
            logs[0].decodedData?.args.number as string
        );
        expect(decodedTag.toLowerCase()).toBe(tag.toLowerCase());
        expect(decodedPayload.toLowerCase()).toBe(
            payload.toString().toLowerCase()
        );
        expect(decodedNumber).toBe(number);
    });
    test('ok <- Mixed event', async () => {
        // call the emit mixed function to emit a mixed event
        const who = Address.of('0x1234567890123456789012345678901234567890');
        const key = Hex.of('0x1111111111111111111111111111111111111111');
        const blob = Hex.of('0x2222222222222222222222222222222222222222');
        const note = 'Hello, world!';
        const count = 1000000000000000000n;
        const txId = await eventContract.transact.emitMixed(
            who.toString(),
            key.toPaddedString(64),
            blob.toString(),
            note,
            count
        );
        await thorClient.transactions.waitForTransactionReceipt(txId);
        // get the mixed event abi
        const mixedEventAbi = eventContractAbi.find(
            (abi) => abi.type === 'event' && abi.name === 'Mixed'
        ) as AbiEvent;
        if (!mixedEventAbi) {
            throw new Error('Mixed event not found');
        }
        // filter the data only event
        // who and key are indexed, so we need to filter by both
        const filter: EventLogFilter = {
            range: {
                unit: 'block',
                from: bestBlockNumber
            },
            criteriaSet: [
                {
                    address: eventContractAddress,
                    topic0: Hex.of(toEventSelector(mixedEventAbi)),
                    topic1: who,
                    topic2: key
                }
            ]
        };
        const logs = await thorClient.logs.filterEventLogs(filter, [
            mixedEventAbi
        ]);
        expect(logs).toBeDefined();
        expect(logs.length).toBe(1);
        // check the event log
        expect(logs[0].eventLog.address.toString().toLowerCase()).toBe(
            eventContractAddress.toString().toLowerCase()
        );
        expect(logs[0].eventLog.topics[0].toString().toLowerCase()).toBe(
            toEventSelector(mixedEventAbi).toLowerCase()
        );
        const expectedData = encodeAbiParameters(
            [
                { type: 'bytes' }, // blob
                { type: 'string' }, // note
                { type: 'uint256' } // count
            ],
            [blob.asHex(), note, count]
        );
        expect(logs[0].eventLog.data.toString().toLowerCase()).toBe(
            expectedData.toLowerCase()
        );
        // check the decoded data
        expect(logs[0].decodedData).toBeDefined();
        expect(logs[0].decodedData?.eventName).toBe('Mixed');
        const decodedWho = logs[0].decodedData?.args.who as string;
        const decodedKey = logs[0].decodedData?.args.key as string;
        const decodedBlob = logs[0].decodedData?.args.blob as string;
        const decodedNote = logs[0].decodedData?.args.note as string;
        const decodedCount = BigInt(logs[0].decodedData?.args.count as string);
        expect(decodedWho.toLowerCase()).toBe(who.toString().toLowerCase());
        expect(decodedKey.toLowerCase()).toBe(
            key.toPaddedString(64).toLowerCase()
        );
        expect(decodedBlob.toLowerCase()).toBe(blob.toString().toLowerCase());
        expect(decodedNote.toLowerCase()).toBe(note.toLowerCase());
        expect(decodedCount).toBe(count);
    });
    test('ok <- TripleTopicWithData event', async () => {
        // call the emit mixed function to emit a mixed event
        const a = Address.of('0x1234567890123456789012345678901234567890');
        const b = Address.of('0x1234567890123456789012345678901234567891');
        const tag = Hex.of('0x1111111111111111111111111111111111111111');
        const message = 'Hello, world!';
        const amount = 1000000000000000000n;
        const txId = await eventContract.transact.emitTripleTopicWithData(
            a.toString(),
            b.toString(),
            tag.toPaddedString(64),
            message,
            amount
        );
        await thorClient.transactions.waitForTransactionReceipt(txId);
        // get the triple topic with data event abi
        const tripleTopicWithDataEventAbi = eventContractAbi.find(
            (abi) => abi.type === 'event' && abi.name === 'TripleTopicWithData'
        ) as AbiEvent;
        if (!tripleTopicWithDataEventAbi) {
            throw new Error('TripleTopicWithData event not found');
        }
        // filter the data only event
        // a, b and tag are indexed, so we need to filter by all three
        const filter: EventLogFilter = {
            range: {
                unit: 'block',
                from: bestBlockNumber
            },
            criteriaSet: [
                {
                    address: eventContractAddress,
                    topic0: Hex.of(
                        toEventSelector(tripleTopicWithDataEventAbi)
                    ),
                    topic1: a,
                    topic2: b,
                    topic3: tag
                }
            ]
        };
        const logs = await thorClient.logs.filterEventLogs(filter, [
            tripleTopicWithDataEventAbi
        ]);
        expect(logs).toBeDefined();
        expect(logs.length).toBe(1);
        // check the event log
        expect(logs[0].eventLog.address.toString().toLowerCase()).toBe(
            eventContractAddress.toString().toLowerCase()
        );
        expect(logs[0].eventLog.topics[0].toString().toLowerCase()).toBe(
            toEventSelector(tripleTopicWithDataEventAbi).toLowerCase()
        );
        expect(logs[0].eventLog.topics[1].toString().toLowerCase()).toBe(
            a.toPaddedString(64).toLowerCase()
        );
        expect(logs[0].eventLog.topics[2].toString().toLowerCase()).toBe(
            b.toPaddedString(64).toLowerCase()
        );
        expect(logs[0].eventLog.topics[3].toString().toLowerCase()).toBe(
            tag.toPaddedString(64).toLowerCase()
        );
        const expectedData = encodeAbiParameters(
            [
                { type: 'string' }, // message
                { type: 'uint256' } // amount
            ],
            [message, amount]
        );
        expect(logs[0].eventLog.data.toString().toLowerCase()).toBe(
            expectedData.toLowerCase()
        );
        // check the decoded data
        expect(logs[0].decodedData).toBeDefined();
        expect(logs[0].decodedData?.eventName).toBe('TripleTopicWithData');
        const decodedA = logs[0].decodedData?.args.a as string;
        const decodedB = logs[0].decodedData?.args.b as string;
        const decodedTag = logs[0].decodedData?.args.tag as string;
        const decodedMessage = logs[0].decodedData?.args.message as string;
        const decodedAmount = BigInt(
            logs[0].decodedData?.args.amount as string
        );
        expect(decodedA.toLowerCase()).toBe(a.toString().toLowerCase());
        expect(decodedB.toLowerCase()).toBe(b.toString().toLowerCase());
        expect(decodedTag.toLowerCase()).toBe(
            tag.toPaddedString(64).toLowerCase()
        );
        expect(decodedMessage.toLowerCase()).toBe(message.toLowerCase());
        expect(decodedAmount).toBe(amount);
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
        const logs = await thorClient.logs.filterEventLogs(filter, [
            noteEventAbi
        ]);
        expect(logs).toBeDefined();
        expect(logs.length).toBe(0);
    });
    test('abi doesnt match logs topic0', async () => {
        // emit a note event, but try to decode it with a different abi
        const who = Address.of('0x1234567890123456789012345678901234567890');
        const note = 'Hello, world!';
        const txId = await eventContract.transact.emitNote(
            who.toString(),
            note
        );
        await thorClient.transactions.waitForTransactionReceipt(txId);
        // get the note event abi
        const noteEventAbi = eventContractAbi.find(
            (abi) => abi.type === 'event' && abi.name === 'Note'
        ) as AbiEvent;
        if (!noteEventAbi) {
            throw new Error('Note event not found');
        }
        // get the mixed event abi
        const mixedEventAbi = eventContractAbi.find(
            (abi) => abi.type === 'event' && abi.name === 'Mixed'
        ) as AbiEvent;
        if (!mixedEventAbi) {
            throw new Error('Mixed event not found');
        }
        // filter the event logs with a filter that will match the note event
        const filter: EventLogFilter = {
            range: {
                unit: 'block',
                from: bestBlockNumber
            },
            criteriaSet: [
                {
                    address: eventContractAddress,
                    topic0: Hex.of(toEventSelector(noteEventAbi)),
                    topic1: who
                }
            ]
        };
        // try to decode it with a non matching abi
        await expect(
            thorClient.logs.filterEventLogs(filter, [mixedEventAbi])
        ).rejects.toThrow('Topic not found in the provided ABIs.');
    });
});
