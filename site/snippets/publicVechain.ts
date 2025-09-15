import { createPublicClient, ThorNetworks } from '@vechain/sdk';

export const publicClientVechain = createPublicClient({
    network: ThorNetworks.SOLONET
});
