"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const ethers_1 = require("ethers");
const src_1 = require("../../../../src/");
const fixture_unit_1 = require("./fixture-unit");
/**
 * VeChain base signer tests
 *
 * @group unit/signers/vechain-base-signer
 */
(0, globals_1.describe)('VeChain base signer tests', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient;
    let provider;
    /**
     * Init thor client and provider before each test
     */
    (0, globals_1.beforeEach)(() => {
        thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
        provider = new src_1.VeChainProvider(thorClient);
    });
    /**
     * Destroy thor client and provider after each test
     */
    (0, globals_1.afterEach)(() => {
        provider.destroy();
    });
    /**
     * Positive case tests
     */
    (0, globals_1.describe)('Positive case', () => {
        /**
         * Should be able to connect with a provider
         */
        (0, globals_1.test)('Should be able to connect with a provider', () => {
            // Provider is NOT attached
            const signerWithoutProvider = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of('7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158').bytes);
            (0, globals_1.expect)(signerWithoutProvider.provider).toBeUndefined();
            // Attach the provider
            const signerWithProvider = signerWithoutProvider.connect(provider);
            (0, globals_1.expect)(signerWithProvider.provider).toBe(provider);
        });
        /**
         * Should be able to get the address of the signer
         */
        (0, globals_1.test)('Should be able to get the address of the signer', async () => {
            const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of('7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158').bytes, provider);
            const address = await signer.getAddress();
            (0, globals_1.expect)(address).toBe(sdk_core_1.Address.checksum(sdk_core_1.HexUInt.of('0x3db469a79593dcc67f07DE1869d6682fC1eaf535')));
        });
        /**
         * Should be able to get the nonce
         */
        (0, globals_1.test)('Should be able to get the nonce', async () => {
            // Generate nonce (provider attached and detached)
            for (const tempProvider of [provider, undefined]) {
                const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of('7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158').bytes, tempProvider);
                const nonce = await signer.getNonce('latest');
                (0, globals_1.expect)(nonce).toBeDefined();
            }
        });
        /**
         * Should be able to populate call
         */
        (0, globals_1.describe)('populateCall method', () => {
            /**
             * Positive case tests
             */
            fixture_unit_1.populateCallTestCases.positive.forEach((fixture) => {
                (0, globals_1.test)(fixture.description, async () => {
                    // Test with provider attached and detached
                    const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(fixture_unit_1.populateCallTestCasesAccount.privateKey).bytes);
                    const populatedCallTransaction = await signer.populateCall(fixture.transactionToPopulate);
                    (0, globals_1.expect)(populatedCallTransaction).toStrictEqual(fixture.expected);
                });
            });
            /**
             * Negative case tests
             */
            fixture_unit_1.populateCallTestCases.negative.forEach((fixture) => {
                (0, globals_1.test)(fixture.description, async () => {
                    // Test with provider attached and detached
                    const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(fixture_unit_1.populateCallTestCasesAccount.privateKey).bytes);
                    await (0, globals_1.expect)(signer.populateCall(fixture.transactionToPopulate)).rejects.toThrowError(fixture.expectedError);
                });
            });
        });
    });
    (0, globals_1.describe)('resolveName(vnsName)', () => {
        (0, globals_1.test)('Should return null if provider is not set', async () => {
            const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of('7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158').bytes);
            const name = 'test-sdk.vet';
            const result = await signer.resolveName(name);
            (0, globals_1.expect)(result).toEqual(null);
        });
        (0, globals_1.test)('Should use vnsUtils.resolveName() to resolve an address by name', async () => {
            const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of('7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158').bytes, provider);
            globals_1.jest.spyOn(src_1.vnsUtils, 'resolveName');
            const name = 'test-sdk.vet';
            await signer.resolveName(name);
            (0, globals_1.expect)(src_1.vnsUtils.resolveName).toHaveBeenCalledWith(provider.thorClient, name);
        });
        (0, globals_1.test)('Should return null if there were invalid result', async () => {
            const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of('7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158').bytes, provider);
            const name = 'error.vet';
            globals_1.jest.spyOn(src_1.vnsUtils, 'resolveNames').mockImplementation(async () => {
                return await Promise.resolve([]);
            });
            const address = await signer.resolveName(name);
            (0, globals_1.expect)(address).toEqual(null);
        });
        (0, globals_1.test)('Should pass address provided by resolveNames()', async () => {
            const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of('7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158').bytes, provider);
            const name = 'address1.vet';
            globals_1.jest.spyOn(src_1.vnsUtils, 'resolveName').mockImplementation(async () => {
                return await Promise.resolve('0x0000000000000000000000000000000000000001');
            });
            const address = await signer.resolveName(name);
            (0, globals_1.expect)(address).toEqual('0x0000000000000000000000000000000000000001');
        });
    });
    (0, globals_1.describe)('EIP-191', () => {
        (0, globals_1.test)('signMessage - invalid - simulate a signature error', async () => {
            const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.Hex.of(fixture_unit_1.eip712TestCases.invalid.privateKey).bytes, provider);
            globals_1.jest.spyOn(sdk_core_1.Secp256k1, 'sign').mockImplementationOnce(() => {
                throw Error();
            });
            await (0, globals_1.expect)(signer.signMessage('Hello world!')).rejects.toThrowError();
        });
        (0, globals_1.test)('signMessage - exception when parsing to text', async () => {
            const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.Hex.of(fixture_unit_1.eip712TestCases.invalid.privateKey).bytes, provider);
            const expectedErrorString = 'not an error instance';
            globals_1.jest.spyOn(sdk_core_1.Txt, 'of')
                .mockImplementationOnce(() => {
                throw new Error(expectedErrorString);
            })
                .mockImplementationOnce(() => {
                throw new Error();
            });
            await (0, globals_1.expect)(signer.signMessage(fixture_unit_1.EIP191_MESSAGE)).rejects.toThrowError(expectedErrorString);
            await (0, globals_1.expect)(signer.signMessage(fixture_unit_1.EIP191_MESSAGE)).rejects.toThrowError(`Method 'VeChainAbstractSigner.signMessage' failed.` +
                `\n-Reason: 'The message could not be signed.'` +
                `\n-Parameters: \n\t{\n  "message": "Hello world! - こんにちは世界 - 👋🗺️!"\n}`);
        });
        (0, globals_1.test)('signMessage - ethers compatible - string', async () => {
            const expected = await new ethers_1.Wallet(fixture_unit_1.EIP191_PRIVATE_KEY).signMessage(fixture_unit_1.EIP191_MESSAGE);
            const actual = await new src_1.VeChainPrivateKeySigner(sdk_core_1.Hex.of(fixture_unit_1.EIP191_PRIVATE_KEY).bytes, provider).signMessage(fixture_unit_1.EIP191_MESSAGE);
            (0, globals_1.expect)(actual).toBe(expected);
        });
        (0, globals_1.test)('signMessage - ethers compatible - uint8array', async () => {
            const message = sdk_core_1.Txt.of(fixture_unit_1.EIP191_MESSAGE).bytes;
            const expected = await new ethers_1.Wallet(fixture_unit_1.EIP191_PRIVATE_KEY).signMessage(message);
            const actual = await new src_1.VeChainPrivateKeySigner(sdk_core_1.Hex.of(fixture_unit_1.EIP191_PRIVATE_KEY).bytes, provider).signMessage(message);
            (0, globals_1.expect)(actual).toBe(expected);
        });
    });
    (0, globals_1.describe)('EIP-712', () => {
        (0, globals_1.test)('signTypedData - invalid', async () => {
            const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.Hex.of(fixture_unit_1.eip712TestCases.invalid.privateKey).bytes, provider);
            await (0, globals_1.expect)(signer.signTypedData(fixture_unit_1.eip712TestCases.invalid.domain, fixture_unit_1.eip712TestCases.invalid.types, fixture_unit_1.eip712TestCases.invalid.data, fixture_unit_1.eip712TestCases.invalid.primaryType)).rejects.toThrowError(sdk_errors_1.SignerMethodError);
        });
        (0, globals_1.test)('signTypedData - exception when parsing to hex', async () => {
            const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.Hex.of(fixture_unit_1.eip712TestCases.invalid.privateKey).bytes, provider);
            const expectedErrorString = 'not an error instance';
            globals_1.jest.spyOn(sdk_core_1.Hex, 'of')
                .mockImplementationOnce(() => {
                throw new Error(expectedErrorString);
            })
                .mockImplementationOnce(() => {
                throw new Error();
            });
            await (0, globals_1.expect)(signer.signTypedData(fixture_unit_1.eip712TestCases.valid.domain, fixture_unit_1.eip712TestCases.valid.types, fixture_unit_1.eip712TestCases.valid.data, fixture_unit_1.eip712TestCases.valid.primaryType)).rejects.toThrowError(expectedErrorString);
            await (0, globals_1.expect)(signer.signTypedData(fixture_unit_1.eip712TestCases.valid.domain, fixture_unit_1.eip712TestCases.valid.types, fixture_unit_1.eip712TestCases.valid.data, fixture_unit_1.eip712TestCases.valid.primaryType)).rejects.toThrowError(sdk_errors_1.SignerMethodError);
        });
        (0, globals_1.test)('signTypedData - ethers compatible', async () => {
            const expected = await new ethers_1.Wallet(fixture_unit_1.eip712TestCases.valid.privateKey).signTypedData(fixture_unit_1.eip712TestCases.valid.domain, fixture_unit_1.eip712TestCases.valid.types, fixture_unit_1.eip712TestCases.valid.data);
            (0, globals_1.expect)(expected).toBe(fixture_unit_1.eip712TestCases.valid.signature);
            const privateKeySigner = new src_1.VeChainPrivateKeySigner(sdk_core_1.Hex.of(fixture_unit_1.eip712TestCases.valid.privateKey).bytes, provider);
            const actual = await privateKeySigner.signTypedData(fixture_unit_1.eip712TestCases.valid.domain, fixture_unit_1.eip712TestCases.valid.types, fixture_unit_1.eip712TestCases.valid.data, fixture_unit_1.eip712TestCases.valid.primaryType);
            (0, globals_1.expect)(actual).toBe(expected);
            const actualWithoutPrimaryType = await privateKeySigner.signTypedData(fixture_unit_1.eip712TestCases.valid.domain, fixture_unit_1.eip712TestCases.valid.types, fixture_unit_1.eip712TestCases.valid.data);
            (0, globals_1.expect)(actualWithoutPrimaryType).toBe(expected);
        });
        (0, globals_1.test)('signTypedData - chainId as hex string', async () => {
            const expected = await new ethers_1.Wallet(fixture_unit_1.eip712TestCases.valid.privateKey).signTypedData(fixture_unit_1.eip712TestCases.valid.domain, fixture_unit_1.eip712TestCases.valid.types, fixture_unit_1.eip712TestCases.valid.data);
            (0, globals_1.expect)(expected).toBe(fixture_unit_1.eip712TestCases.valid.signature);
            const privateKeySigner = new src_1.VeChainPrivateKeySigner(sdk_core_1.Hex.of(fixture_unit_1.eip712TestCases.valid.privateKey).bytes, provider);
            const actual = await privateKeySigner.signTypedData({
                ...fixture_unit_1.eip712TestCases.valid.domain,
                chainId: '0x1'
            }, fixture_unit_1.eip712TestCases.valid.types, fixture_unit_1.eip712TestCases.valid.data, fixture_unit_1.eip712TestCases.valid.primaryType);
            (0, globals_1.expect)(actual).toBe(expected);
        });
        (0, globals_1.test)('signTypedData - chainId as bigint', async () => {
            const expected = await new ethers_1.Wallet(fixture_unit_1.eip712TestCases.valid.privateKey).signTypedData(fixture_unit_1.eip712TestCases.valid.domain, fixture_unit_1.eip712TestCases.valid.types, fixture_unit_1.eip712TestCases.valid.data);
            (0, globals_1.expect)(expected).toBe(fixture_unit_1.eip712TestCases.valid.signature);
            const privateKeySigner = new src_1.VeChainPrivateKeySigner(sdk_core_1.Hex.of(fixture_unit_1.eip712TestCases.valid.privateKey).bytes, provider);
            const actual = await privateKeySigner.signTypedData({
                ...fixture_unit_1.eip712TestCases.valid.domain,
                chainId: BigInt(1)
            }, fixture_unit_1.eip712TestCases.valid.types, fixture_unit_1.eip712TestCases.valid.data, fixture_unit_1.eip712TestCases.valid.primaryType);
            (0, globals_1.expect)(actual).toBe(expected);
        });
        (0, globals_1.test)('signTypedData - chainId as invalid string', async () => {
            const privateKeySigner = new src_1.VeChainPrivateKeySigner(sdk_core_1.Hex.of(fixture_unit_1.eip712TestCases.valid.privateKey).bytes, provider);
            await (0, globals_1.expect)(privateKeySigner.signTypedData({
                ...fixture_unit_1.eip712TestCases.valid.domain,
                chainId: 'invalid'
            }, fixture_unit_1.eip712TestCases.valid.types, fixture_unit_1.eip712TestCases.valid.data, fixture_unit_1.eip712TestCases.valid.primaryType)).rejects.toThrow('The typed data could not be signed');
        });
        (0, globals_1.test)('signTypedData - chainId as genesis block id', async () => {
            const privateKeySigner = new src_1.VeChainPrivateKeySigner(sdk_core_1.Hex.of(fixture_unit_1.eip712TestCases.valid.privateKey).bytes, provider);
            const expected = await new ethers_1.Wallet(fixture_unit_1.eip712TestCases.valid.privateKey).signTypedData({
                ...fixture_unit_1.eip712TestCases.valid.domain,
                chainId: '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a'
            }, fixture_unit_1.eip712TestCases.valid.types, fixture_unit_1.eip712TestCases.valid.data);
            const actual = await privateKeySigner.signTypedData({
                ...fixture_unit_1.eip712TestCases.valid.domain,
                chainId: '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a'
            }, fixture_unit_1.eip712TestCases.valid.types, fixture_unit_1.eip712TestCases.valid.data, fixture_unit_1.eip712TestCases.valid.primaryType);
            (0, globals_1.expect)(sdk_core_1.Hex.of(actual).isEqual(sdk_core_1.Hex.of(expected))).toBe(true);
        });
    });
});
