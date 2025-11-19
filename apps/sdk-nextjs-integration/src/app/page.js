'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const components_1 = require("@/components");
const link_1 = __importDefault(require("next/link"));
function Home() {
    return (<main className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <components_1.Header />
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
                        <link_1.default className="text-blue-500 hover:underline" href={'/hash'}>
                            Hash
                        </link_1.default>
                    </p>
                    <p>
                        <b>@vechain/sdk-network</b> integration example:{' '}
                        <link_1.default className="text-blue-500 hover:underline" href={'/transfer-logs'}>
                            Transfer logs
                        </link_1.default>
                    </p>
                </div>
            </div>
        </main>);
}
