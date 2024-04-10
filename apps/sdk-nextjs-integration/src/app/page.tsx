'use client';

import { useState, useEffect } from 'react';
import {
    type CompressedBlockDetail,
    ThorClient,
    FilterTransferLogsOptions
} from '@vechain/sdk-network';


// Url of the vechain testnet
const testnetUrl = 'https://mainnet.vechain.org';

// Thor client
const thorClient = ThorClient.fromUrl(testnetUrl);

// ABI and contract address
const ABI = {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "_from",
        type: "address"
      },
      {
        indexed: true,
        name: "_to",
        type: "address"
      },
      {
        indexed: false,
        name: "_value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
};
const CONTRACT_ADDRESS = "0x0000000000000000000000000000456E65726779";

interface Metadata {
    /**
     * Block identifier associated with the entity
     */
    blockID: string;
    /**
     * Block number associated with the entity
     */
    blockNumber: number;
    /**
     * Timestamp of the block
     */
    blockTimestamp: number;
    /**
     * Transaction ID associated with the entity
     */
    txID: string;
    /**
     * Transaction origin information
     */
    txOrigin: string;
    /**
     * Index of the clause
     */
    clauseIndex: number;
}

interface Transfer {
    from: string;
    to: string;
    amount: string;
    meta: Metadata;
};

export default function Home(): JSX.Element {
    const [transfers, setTransfers] = useState<Transfer[]>([]);
    const [address, setAddress] = useState(
        "0xc3bE339D3D20abc1B731B320959A96A08D479583"
    );

    async function getHistoryFor(address: string) {
        try{
            // Get the latest block
            const bestBlock = await thorClient.blocks.getBestBlockCompressed();

            const filterOptions: FilterTransferLogsOptions = {
                criteriaSet: [
                    { sender: address }, // Transactions sent by the address
                    { recipient: address } // Transactions received by the address
                ],
                order: 'desc', // Order logs by descending timestamp
                range: 
                    { 
                        unit: 'block',
                        from: 0,
                        to: (bestBlock as CompressedBlockDetail).number
                    }, 
            };

            const logs = await thorClient.logs.filterTransferLogs(filterOptions);
            const transfers = logs.map((log) => {
                return {
                    from: log.sender,
                    to: log.recipient,
                    amount: log.amount,
                    meta: log.meta
                };
            });
            setTransfers(transfers);
            console.log(logs);
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
        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
                <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
            </div>
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">sdk-nextsjs-integration</h2>
                <p className="mt-2 text-lg leading-8 text-gray-600">Sample NextJs app</p>
                <input type="text" name="address" id="address" onChange={(e)=>setAddress(e.target.value)} value={address} className="block mx-auto w-full sm:max-w-md border-2 border-transparent focus:border-purple-500 bg-transparent py-2 px-4 text-lg text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none rounded-md" placeholder="0xc3bE339D3D20abc1B731B320959A96A08D479583" />
            </div>
            <table className="table-auto mx-auto">
                <thead>
                    <tr>
                    <th>Time</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Amount</th>
                    <th>Transaction Id</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Time</td>
                        <td>From</td>
                        <td>To</td>
                        <td>Amount</td>
                        <td>Transaction Id</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
