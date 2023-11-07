import { type IAccountClient } from './accounts';

/**
 * The ThorClient interface contains all the methods for interacting with the VeChainThor blockchain.
 * @extends IAccountClient
 */
interface IThorClient extends IAccountClient {}

export type { IThorClient };
