'use client';

import { useState, useEffect } from 'react';
import {
    type CompressedBlockDetail,
    ThorClient,
    type FilterTransferLogsOptions
} from '@vechain/sdk-network';
import { unitsUtils } from '@vechain/sdk-core';

// Url of the vechain mainnet
const mainnetUrl = 'https://mainnet.vechain.org';

// Thor client
const thorClient = ThorClient.fromUrl(mainnetUrl);

// Transfer interface definition for the transfer history
interface Transfer {
    from: string;
    to: string;
    amount: string;
    meta: {
        blockID: string; // Block identifier associated with the entity
        blockNumber: number; // Block number associated with the entity
        blockTimestamp: number; // Timestamp of the block
        txID: string; // Transaction ID associated with the entity
        txOrigin: string; // Transaction origin information
        clauseIndex: number; // Index of the clause
    };
}

export default function Home(): JSX.Element {
    // State to store the transfer history
    const [transfers, setTransfers] = useState<Transfer[]>([]);
    // State to store the address
    const [address, setAddress] = useState(
        '0xc3bE339D3D20abc1B731B320959A96A08D479583'
    );

    /**
     * Function to get the history for the provided address
     * @param address The address to get the history for
     */
    async function getHistoryFor(address: string) {
        try {
            // Get the latest block
            const bestBlock = await thorClient.blocks.getBestBlockCompressed();

            // Filter options for the transfer logs
            const filterOptions: FilterTransferLogsOptions = {
                criteriaSet: [
                    { sender: address }, // Transactions sent by the address
                    { recipient: address } // Transactions received by the address
                ],
                order: 'desc', // Order logs by descending timestamp
                range: {
                    unit: 'block',
                    from: 0,
                    to: (bestBlock as CompressedBlockDetail).number
                }
            };

            // Get the transfer logs
            const logs =
                await thorClient.logs.filterTransferLogs(filterOptions);
            // Map the logs to the transfer interface
            const transfers = logs.map((log) => {
                return {
                    from: log.sender,
                    to: log.recipient,
                    amount: log.amount,
                    meta: log.meta
                };
            });
            setTransfers(transfers);
        } catch (error) {
            setTransfers([]);
            console.log(error);
        }
    }

    // Update the history when the address changes
    useEffect(() => {
        getHistoryFor(address);
    }, [address]);

    return (
        <main className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div
                className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
                aria-hidden="true"
            >
                <div
                    className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
                    }}
                ></div>
            </div>
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    sdk-nextsjs-integration
                </h2>
                <p className="mt-2 text-lg leading-8 text-gray-600">
                    Sample NextJs app
                </p>
                <input
                    type="text"
                    name="address"
                    id="address"
                    onChange={(e) => {
                        setAddress(e.target.value);
                    }}
                    value={address}
                    className="block mx-auto w-full sm:max-w-md border-2 border-transparent focus:border-purple-500 bg-transparent py-2 px-4 text-lg text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none rounded-md"
                    placeholder="0xc3bE339D3D20abc1B731B320959A96A08D479583"
                />
            </div>
            <div className="table-container mx-auto max-w-4xl overflow-x-auto">
                <table className="table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Time</th>
                            <th className="px-4 py-2">From</th>
                            <th className="px-4 py-2">To</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Transaction Id</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transfers.map((transfer, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2">
                                    {new Date(
                                        transfer.meta.blockTimestamp * 1000
                                    ).toISOString()}
                                </td>
                                <td className="px-4 py-2">{transfer.from}</td>
                                <td className="px-4 py-2">{transfer.to}</td>
                                <td className="px-4 py-2">
                                    {unitsUtils.formatVET(transfer.amount)}
                                </td>
                                <td className="px-4 py-2">
                                    {transfer.meta.txID}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
