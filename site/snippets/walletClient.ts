import 'viem/window'

// ---cut---
// [!region imports]
import { createWalletClient, ThorNetworks } from '@vechain/sdk/viem';
// [!endregion imports]

export const walletClient = createWalletClient({
  network: ThorNetworks.MAINNET
});
