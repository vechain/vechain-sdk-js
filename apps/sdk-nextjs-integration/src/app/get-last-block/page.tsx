'use client';

import { type CompressedBlockDetail } from '@vechain/sdk-network';
import { useState } from 'react';
import { thorClient } from '@/const';
import { Header } from '@/components';

export default function LastBlockPage(): JSX.Element {
    const [block, setBlock] = useState<CompressedBlockDetail | null>(null);

    // Function to fetch the last block
    const fetchLastBlock = async (): Promise<void> => {
        try {
            const lastBlock =
                await thorClient.blocks.getBlockCompressed('best');
            setBlock(lastBlock);
        } catch (error) {
            console.error('Error fetching the last block:', error);
        }
    };

    return (
        <main className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <Header />
            <div className="my-20 mx-auto max-w-2xl text-center">
                <p className="my-5 text-lg leading-8 text-gray-600">
                    Press button below to get last block details
                </p>
                <div>
                    <button
                        onClick={() => {
                            void (async () => {
                                await fetchLastBlock();
                            })();
                        }}
                        data-testid="getlastblock"
                        style={{
                            backgroundColor: '#333',
                            color: '#fff',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Get Last Block
                    </button>
                    {block != null && (
                        <div>
                            <h3>Last Block Details:</h3>
                            <pre data-testid="last-block-details">
                                {JSON.stringify(block, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
