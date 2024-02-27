'use client';

import { mnemonic } from '@vechain/vechain-sdk-core';
import { useState } from 'react';
import {
    type CompressedBlockDetail,
    HttpClient,
    ThorClient
} from '@vechain/vechain-sdk-network';

/**
 * Url of the testnet fixture
 */
const testnetUrl = 'https://testnet.vechain.org';

/**
 * Test Network instance fixture
 */
const testNetwork = new HttpClient(testnetUrl);

/**
 * Main thor client
 */
const thorClient = new ThorClient(testNetwork);

export default function Home() {
    // Random wallet
    const [mnemonicWallet, setMnemonicWallet] = useState<string[]>([]);
    const generateWallet = (): void => {
        setMnemonicWallet(mnemonic.generate());
    };

    // Block
    const [block, setBlock] = useState<CompressedBlockDetail | null>(null);

    const getLatestBlock = async (): Promise<void> => {
        const latestBlock = await thorClient.blocks.getBestBlockCompressed();
        setBlock(latestBlock);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {/* Welcome Header */}
            <div>
                <header className="flex flex-col items-center justify-center">
                    <h1 className="text-5xl font-bold">
                        Welcome to Vechain SDK
                    </h1>
                </header>
            </div>

            {/* Wallet words */}
            <div>
                <p className="text-2xl font-bold">
                    {mnemonicWallet.length > 0
                        ? mnemonicWallet.join(' ')
                        : 'Click on "Generate Wallet" button'}
                </p>
            </div>

            {/* Block */}
            <div>
                <p className="text-2xl font-bold">
                    {block !== null
                        ? block.id
                        : 'Click on "Get latest block" button'}
                </p>
            </div>

            {/* Generate Wallet button */}
            <div className={'flex flex-row justify-end'}>
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-4"
                        onClick={() => {
                            generateWallet();
                        }}
                    >
                        Generate Wallet
                    </button>
                    <br />
                    (vechain-sdk-core)
                </div>

                {/* Get latest block */}
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-4"
                        onClick={async (): Promise<void> => {
                            await getLatestBlock();
                        }}
                    >
                        Get latest block
                    </button>
                    <br />
                    (vechain-sdk-network)
                </div>
            </div>
        </main>
    );
}
