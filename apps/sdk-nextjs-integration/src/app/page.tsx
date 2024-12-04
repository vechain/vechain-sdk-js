'use client';

import { Header } from '@/components';
import Link from 'next/link';

export default function Home(): JSX.Element {
    return (
        <main className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <Header />
            <div className="flex flex-col text-center justify-center">
                {/* Title */}
                <div>
                    <h1 className="text-2xl font-bold">
                        Welcome to the SDK Next.js Integration!
                    </h1>
                </div>
                {/* Subtitle */}
                <div>
                    <h2 className="text-base my-5">
                        In this project you will find some cool examples of how
                        to integrate the Vechain SDK with Next.js
                    </h2>
                </div>

                {/* Links to examples */}
                <div className="text-center flex flex-col space-y-2 my-10">
                    <p>
                        <b>@vechain/sdk-core</b> integration example:{' '}
                        <Link
                            className="text-blue-500 hover:underline"
                            href={'/hash'}
                            data-testid="hash-link"
                        >
                            Hash
                        </Link>
                    </p>
                    <p>
                        <b>@vechain/sdk-network</b> integration example:{' '}
                        <Link
                            className="text-blue-500 hover:underline"
                            href={'/transfer-logs'}
                            data-testid="transfers-link"
                        >
                            Transfer logs
                        </Link>
                    </p>
                    <p>
                        <b>@vechain/sdk-network</b> integration example:{' '}
                        <Link
                            className="text-blue-500 hover:underline"
                            href={'/get-last-block'}
                            data-testid="latest-block-link"
                        >
                            Get last block
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
