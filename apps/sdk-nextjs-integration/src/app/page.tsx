'use client';

import { mnemonic } from '@vechain/sdk-core';
import { useState } from 'react';
import {
    type CompressedBlockDetail,
    HttpClient,
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

export default function Home(): JSX.Element {
    const [transfers, setTransfers] = useState([]);
    const [address, setAddress] = useState(
        "0x0000000000000000000000000000456E65726779"
    );

    async function getHistoryFor(address: string) {
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

        const res = await thorClient.logs.filterTransferLogs(filterOptions);

        console.log(res);
    }

    // Block
    const [block, setBlock] = useState<CompressedBlockDetail | null>(null);

    const getLatestBlock = async (): Promise<void> => {
        const latestBlock = await thorClient.blocks.getBestBlockCompressed();
        setBlock(latestBlock);
    };

    return (
        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
                <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
            </div>
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">sdk-nextsjs-integration</h2>
                <p className="mt-2 text-lg leading-8 text-gray-600">Sample NextJs app</p>
            </div>
            <p>ciaoo</p>
        </div>
    );
}
