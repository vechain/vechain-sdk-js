import { VeChainProvider, type VeChainSigner } from '@vechain/sdk-network';
import { KMSVeChainSigner } from './KMSVeChainSigner';

class KMSVeChainProvider extends VeChainProvider {
    public override async getSigner(
        _addressOrIndex?: string | number
    ): Promise<VeChainSigner | null> {
        // Get the signer
        return await Promise.resolve(new KMSVeChainSigner());
    }
}

export { KMSVeChainProvider };
