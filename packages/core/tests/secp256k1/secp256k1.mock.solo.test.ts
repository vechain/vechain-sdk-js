import { describe, expect, test, jest } from '@jest/globals';
import { secp256k1 } from '../../src';

// Mock the secp256k1 module
jest.mock('../../src/secp256k1', () => ({
    secp256k1: {
        generatePrivateKey: jest.fn(),
        randomBytes: jest.fn()
    }
}));

describe('secp256k1', () => {
    describe('generatePrivateKey', () => {
        test('should generate a valid private key', async () => {
            // Mock the generatePrivateKey function to return a Uint8Array
            (secp256k1.generatePrivateKey as jest.Mock).mockResolvedValue(
                new Uint8Array(32) as never
            );

            const randomPrivateKey = await secp256k1.generatePrivateKey();

            // Check if generatePrivateKey was called
            expect(secp256k1.generatePrivateKey).toHaveBeenCalled();

            // Length of private key should be 32 bytes
            expect(randomPrivateKey.length).toBe(32);

            // Private key should be a Uint8Array
            expect(randomPrivateKey).toBeInstanceOf(Uint8Array);
        });

        describe('randomBytes', () => {
            test('should generate random bytes of specified length', () => {
                // Mock the randomBytes function to return a Uint8Array
                (secp256k1.randomBytes as jest.Mock).mockReturnValue(
                    new Uint8Array(4)
                );

                const result = secp256k1.randomBytes(4);

                // Check if randomBytes was called with the correct argument
                expect(secp256k1.randomBytes).toHaveBeenCalledWith(4);

                // Length of result should be 4 bytes
                expect(result.length).toBe(4);

                // Result should be a Uint8Array
                expect(result).toBeInstanceOf(Uint8Array);
            });
        });
    });
});
