import { type ThorClient } from '../../../../../thor-client';
/**
 * RPC Method net_version implementation
 *
 * @link [net_version](https://docs.infura.io/networks/ethereum/json-rpc-methods/net_version)
 *
 * @param thorClient - ThorClient instance.
 *
 * @returns The net version (equivalent to chain id in our case).
 */
declare const netVersion: (thorClient: ThorClient) => Promise<string>;
export { netVersion };
//# sourceMappingURL=net_version.d.ts.map