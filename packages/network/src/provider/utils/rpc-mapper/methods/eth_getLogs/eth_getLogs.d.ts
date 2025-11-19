import { type LogsRPC } from '../../../formatter';
import { type ThorClient } from '../../../../../thor-client';
/**
 * RPC Method eth_getLogs implementation
 *
 * @link [eth_getLogs](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @returns An array of log objects, or an empty array if nothing has changed since last poll
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
declare const ethGetLogs: (thorClient: ThorClient, params: unknown[]) => Promise<LogsRPC[]>;
export { ethGetLogs };
//# sourceMappingURL=eth_getLogs.d.ts.map