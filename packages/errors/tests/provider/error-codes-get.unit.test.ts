import { describe, expect, test } from '@jest/globals';
import {
    EIP1193,
    getEIP1193ErrorCode,
    getJSONRPCErrorCode,
    JSONRPC
} from '../../src';

/**
 * Test the get error codes from EIP1193 and JSON-RPC
 * @group unit/errors/provider/error-codes-get
 */
describe('Assertion test', () => {
    /**
     * EIP1193 error codes
     */
    test('EIP1193 error codes get test', () => {
        expect(getEIP1193ErrorCode(EIP1193.USER_REJECTED_REQUEST)).toBe(4001);
        expect(getEIP1193ErrorCode(EIP1193.UNAUTHORIZED)).toBe(4100);
        expect(getEIP1193ErrorCode(EIP1193.UNSUPPORTED_METHOD)).toBe(4200);
        expect(getEIP1193ErrorCode(EIP1193.DISCONNECTED)).toBe(4900);
        expect(getEIP1193ErrorCode(EIP1193.CHAIN_DISCONNECTED)).toBe(4901);
    });

    /**
     * JSON-RPC error codes
     */
    test('JSON-RPC error codes get test', () => {
        expect(getJSONRPCErrorCode(JSONRPC.PARSE_ERROR)).toBe(-32700);
        expect(getJSONRPCErrorCode(JSONRPC.INVALID_REQUEST)).toBe(-32600);
        expect(getJSONRPCErrorCode(JSONRPC.METHOD_NOT_FOUND)).toBe(-32601);
        expect(getJSONRPCErrorCode(JSONRPC.INVALID_PARAMS)).toBe(-32602);
        expect(getJSONRPCErrorCode(JSONRPC.INTERNAL_ERROR)).toBe(-32603);
        expect(getJSONRPCErrorCode(JSONRPC.DEFAULT)).toBe(-32000);
    });
});
