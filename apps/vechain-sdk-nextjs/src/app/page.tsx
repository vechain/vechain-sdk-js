'use client';

import { mnemonic } from '@vechain/vechain-sdk-core';
import {useState} from "react";

export default function Home() {

    const [mnemonicWallet, setMnemonicWallet] = useState<string[]>([]);
    const generateWallet = (): void => {
        setMnemonicWallet(mnemonic.generate());
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

            {/*Wallet words*/}
            <div>
                <p className="text-2xl font-bold">
                    {mnemonicWallet.join(' ')}
                </p>
            </div>

            {/* Generate Wallet button */}
            <div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        generateWallet();
                    }}
                >
                    Generate Wallet
                </button>
            </div>
        </main>
    );
}
