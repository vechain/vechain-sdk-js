import { type CompressedBlockDetail, ThorClient } from "@vechain/sdk-network";
import { useState } from "react";

const GetLastBlock = () => {
    const [block, setBlock] = useState<CompressedBlockDetail | null>(null);

    // URL of the VeChain mainnet
    const mainnetUrl = 'https://mainnet.vechain.org';

    // Thor client instance
    const thorClient = ThorClient.fromUrl(mainnetUrl);

    // Function to fetch the last block
    const fetchLastBlock = async () => {
        try {
            const lastBlock = await thorClient.blocks.getBlockCompressed("best");
            setBlock(lastBlock);
        } catch (error) {
            console.error("Error fetching the last block:", error);
        }
    };

    return (
        <div>
            <button onClick={fetchLastBlock} data-testid="getlastblock">
                Get Last Block
            </button>
            {block && (
                <div>
                    <h3>Last Block Details:</h3>
                    <pre data-testid="last-block-details">{JSON.stringify(block, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default GetLastBlock;
