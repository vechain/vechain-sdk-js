'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HashPage;
const react_1 = require("react");
const sdk_core_1 = require("@vechain/sdk-core");
const components_1 = require("@/components");
function HashPage() {
    // State of content to hash
    const [contentToHash, setContentToHash] = (0, react_1.useState)('Hello World!');
    // State of Hashed content
    const [hashedContent, setHashedContent] = (0, react_1.useState)({
        blake2b256: '',
        keccak256: '',
        sha256: ''
    });
    /**
     * Function to get the history for the provided address
     * @param content The address to get the history for
     */
    function hashContent(content) {
        try {
            setHashedContent({
                blake2b256: sdk_core_1.Blake2b256.of(sdk_core_1.Txt.of(content).bytes).toString(),
                keccak256: sdk_core_1.Keccak256.of(sdk_core_1.Txt.of(content).bytes).toString(),
                sha256: sdk_core_1.Sha256.of(sdk_core_1.Txt.of(content).bytes).toString()
            });
        }
        catch (error) {
            setHashedContent({
                blake2b256: '0xbf56c0728fd4e9cf64bfaf6dabab81554103298cdee5cc4d580433aa25e98b00',
                keccak256: '0x3ea2f1d0abf3fc66cf29eebb70cbd4e7fe762ef8a09bcc06c8edf641230afec0',
                sha256: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
            });
            console.log(error);
        }
    }
    // Update the history when the address changes
    (0, react_1.useEffect)(() => {
        hashContent(contentToHash);
    }, [contentToHash]);
    return (<main className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <components_1.Header />
            <div className="my-20 mx-auto max-w-2xl text-center">
                <p className="my-5 text-lg leading-8 text-gray-600">
                    Insert some content to hash
                </p>
                <input type="text" name="contentToHash" data-testid="contentToHash" onChange={(e) => {
            setContentToHash(e.target.value);
        }} value={contentToHash} className="block mx-auto w-full sm:max-w-md border-2 border-dark focus:border-purple-500 bg-transparent py-2 px-4 text-lg text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none rounded-md" placeholder="0xc3bE339D3D20abc1B731B320959A96A08D479583"/>
            </div>
            <div className="table-container mx-auto max-w-4xl overflow-x-auto text-center justify-center flex flex-col">
                <p className="px-4 py-2" data-testid="blake2b256HashLabel">
                    <b>Blake2b256</b>: {hashedContent.blake2b256}
                </p>
                <p className="px-4 py-2" data-testid="keccak256HashLabel">
                    <b>Keccak256</b>: {hashedContent.keccak256}
                </p>
                <p className="px-4 py-2" data-testid="sha256HashLabel">
                    <b>Sha256</b>: {hashedContent.sha256}
                </p>
            </div>
        </main>);
}
