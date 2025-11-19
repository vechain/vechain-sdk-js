import { ERC20_ABI } from './fixture';
import { ERC721_ABI } from '@vechain/sdk-core';
import { type SubscriptionEvent, type ThorClient, type VeChainProvider, type VeChainSigner, type Contract } from '../../../src';
export declare function waitForMessage(provider: VeChainProvider): Promise<SubscriptionEvent>;
export declare function deployERC20Contract(thorClient: ThorClient, signer: VeChainSigner): Promise<Contract<typeof ERC20_ABI>>;
export declare function deployERC721Contract(thorClient: ThorClient, signer: VeChainSigner): Promise<Contract<typeof ERC721_ABI>>;
//# sourceMappingURL=helpers.d.ts.map