import { type ThorClient } from '../../../thor-client';
import { type VeChainProvider } from '../../providers/vechain-provider';
type MethodHandlerType<TParams, TReturnType> = (params: TParams[]) => Promise<TReturnType>;
/**
 * Map of RPC methods to their implementations with the SDK.
 * We can consider this as an "RPC Mapper" for the SDK.
 *
 * List of all RPC methods:
 * * https://eth.wiki/json-rpc/API
 * * https://ethereum.github.io/execution-apis/api-documentation/
 *
 * @param thorClient - ThorClient instance.
 * @param provider - Provider instance. It is optional because the majority of the methods do not require a provider.
 */
declare const RPCMethodsMap: (thorClient: ThorClient, provider?: VeChainProvider) => Record<string, MethodHandlerType<unknown, unknown>>;
export { RPCMethodsMap };
//# sourceMappingURL=rpc-mapper.d.ts.map