import { describe, expect, test } from '@jest/globals';
import {
    validateSiweMessage,
    parseSiweMessage,
    generateSiweNonce,
    createSiweMessage
} from '@reexports/siwe';
import { ZERO_ADDRESS } from '@utils';

/**
 * Test suite for SIWE (Sign-In with Ethereum) functionality
 *
 * Tests the integration of SIWE with VeChain SDK clients:
 * - Message creation and parsing
 * - Message validation
 * - Nonce generation
 * - Message signing and verification
 *
 * @group integration/siwe
 */
describe('SIWE Integration Tests', () => {
    const accountAddress = ZERO_ADDRESS;

    describe('generateSiweNonce', () => {
        test('should generate a valid nonce', () => {
            const nonce = generateSiweNonce();

            expect(nonce).toBeDefined();
            expect(typeof nonce).toBe('string');
            expect(nonce.length).toBeGreaterThan(0);
        });

        test('should generate different nonces on subsequent calls', () => {
            const nonce1 = generateSiweNonce();
            const nonce2 = generateSiweNonce();

            expect(nonce1).not.toBe(nonce2);
        });
    });

    describe('createSiweMessage', () => {
        test('should create a properly formatted SIWE message', () => {
            const nonce = generateSiweNonce();
            const message = createSiweMessage({
                address: accountAddress.toString() as `0x${string}`,
                chainId: 1,
                domain: 'example.com',
                nonce,
                uri: 'https://example.com/path',
                version: '1'
            });

            expect(message).toBeDefined();
            expect(typeof message).toBe('string');
            expect(message).toContain(
                'example.com wants you to sign in with your Ethereum account:'
            );
            expect(message).toContain(accountAddress.toString());
            expect(message).toContain(nonce);
            expect(message).toContain('https://example.com/path');
        });

        test('should create message with optional statement', () => {
            const message = createSiweMessage({
                address: accountAddress.toString() as `0x${string}`,
                chainId: 1,
                domain: 'example.com',
                nonce: 'foobarbaz',
                uri: 'https://example.com/path',
                version: '1',
                statement:
                    'I accept the ExampleOrg Terms of Service: https://example.com/tos'
            });

            expect(message).toContain(
                'I accept the ExampleOrg Terms of Service: https://example.com/tos'
            );
        });
    });

    describe('parseSiweMessage', () => {
        test('should parse a valid SIWE message into fields', () => {
            const siweMessage = `example.com wants you to sign in with your Ethereum account:
0xA0Cf798816D4b9b9866b5330EEa46a18382f251e

I accept the ExampleOrg Terms of Service: https://example.com/tos

URI: https://example.com/path
Version: 1
Chain ID: 1
Nonce: foobarbaz
Issued At: 2023-02-01T00:00:00.000Z`;

            const fields = parseSiweMessage(siweMessage);

            expect(fields).toBeDefined();
            expect(fields.address).toBe(
                '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'
            );
            expect(fields.chainId).toBe(1);
            expect(fields.domain).toBe('example.com');
            expect(fields.nonce).toBe('foobarbaz');
            expect(fields.uri).toBe('https://example.com/path');
            expect(fields.version).toBe('1');
            expect(fields.statement).toBe(
                'I accept the ExampleOrg Terms of Service: https://example.com/tos'
            );
        });

        test('should parse message without optional fields', () => {
            const siweMessage = `example.com wants you to sign in with your Ethereum account:
0xA0Cf798816D4b9b9866b5330EEa46a18382f251e

URI: https://example.com/path
Version: 1
Chain ID: 1
Nonce: foobarbaz
Issued At: 2023-02-01T00:00:00.000Z`;

            const fields = parseSiweMessage(siweMessage);

            expect(fields).toBeDefined();
            expect(fields.address).toBe(
                '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'
            );
            expect(fields.statement).toBeUndefined();
        });
    });

    describe('validateSiweMessage', () => {
        test('should validate message structure correctly', () => {
            const validResult = validateSiweMessage({
                address:
                    '0xd2135CfB216b74109775236E36d4b433F1DF507B' as `0x${string}`,
                message: {
                    address: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
                    chainId: 1,
                    domain: 'example.com',
                    nonce: 'foobarbaz',
                    uri: 'https://example.com/path',
                    version: '1'
                }
            });

            expect(validResult).toBe(true);
        });

        test('should reject message with mismatched address', () => {
            const invalidResult = validateSiweMessage({
                address:
                    '0xd2135CfB216b74109775236E36d4b433F1DF507B' as `0x${string}`,
                message: {
                    address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e', // Different address
                    chainId: 1,
                    domain: 'example.com',
                    nonce: 'foobarbaz',
                    uri: 'https://example.com/path',
                    version: '1'
                }
            });

            expect(invalidResult).toBe(false);
        });
    });

    describe('End-to-end SIWE workflow', () => {
        test('should create, parse, and validate a complete SIWE message', () => {
            const nonce = generateSiweNonce();

            // Create message
            const message = createSiweMessage({
                address: accountAddress.toString() as `0x${string}`,
                chainId: 1,
                domain: 'example.com',
                nonce,
                uri: 'https://example.com/path',
                version: '1',
                statement: 'Please sign this message to authenticate.'
            });

            // Parse message back to fields
            const parsedFields = parseSiweMessage(message);

            // Validate the parsed message
            const isValid = validateSiweMessage({
                address: accountAddress.toString() as `0x${string}`,
                message: parsedFields
            });

            expect(isValid).toBe(true);
            expect(parsedFields.address).toBe(accountAddress.toString());
            expect(parsedFields.nonce).toBe(nonce);
            expect(parsedFields.domain).toBe('example.com');
        });
    });
});
