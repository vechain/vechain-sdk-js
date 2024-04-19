import { type vechain_sdk_core_ethers } from '@vechain/sdk-core';

/**
 * Override the JsonRpcPayload, JsonRpcResult and JsonRpcError types from ethers.
 */
type JsonRpcPayload = vechain_sdk_core_ethers.JsonRpcPayload;
type JsonRpcResult = vechain_sdk_core_ethers.JsonRpcResult;
type JsonRpcError = vechain_sdk_core_ethers.JsonRpcError;

export { type JsonRpcPayload, type JsonRpcResult, type JsonRpcError };
