// [!region imports]
import { createPublicClient, ThorNetworks } from '@vechain/sdk/viem';
// [!endregion imports]

export const publicClient = createPublicClient({
    network: ThorNetworks.MAINNET
});
