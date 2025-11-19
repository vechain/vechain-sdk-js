"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const sdk_network_1 = require("@vechain/sdk-network");
const src_1 = require("../src");
const dummy_data_1 = require("./dummy_data");
jest.mock('asn1js', () => ({
    Sequence: jest.fn(),
    ObjectIdentifier: jest.fn(),
    BitString: jest.fn(),
    verifySchema: jest.fn().mockImplementation(() => ({
        verified: false
    }))
}));
/**
 * AWS KMS VeChain signer tests - unit
 *
 * @group unit/signers/vechain-aws-kms-signer
 */
describe('KMSVeChainSigner', () => {
    describe('constructor', () => {
        it('should break if the provider is not a KMSVeChainProvider', () => {
            expect(() => new src_1.KMSVeChainSigner(new sdk_network_1.VeChainProvider({}))).toThrow(sdk_errors_1.JSONRPCInvalidParams);
        });
    });
    describe('connect', () => {
        it('should break if the provider is not a KMSVeChainProvider', () => {
            const signer = new src_1.KMSVeChainSigner();
            expect(() => signer.connect(new sdk_network_1.VeChainProvider({}))).toThrow(sdk_errors_1.SignerMethodError);
        });
    });
    describe('getAddress', () => {
        it('should break if there is no provider', async () => {
            const signer = new src_1.KMSVeChainSigner();
            await expect(signer.getAddress()).rejects.toThrow(sdk_errors_1.SignerMethodError);
        });
        it('should break if asn1 decoding fails', async () => {
            const provider = new src_1.KMSVeChainProvider({}, { keyId: 'keyId', region: 'region' });
            jest.spyOn(provider, 'getPublicKey').mockResolvedValue(sdk_core_1.Txt.of('publicKey').bytes);
            const signer = new src_1.KMSVeChainSigner(provider);
            await expect(signer.getAddress()).rejects.toThrow(sdk_errors_1.SignerMethodError);
        });
    });
    describe('signTransaction', () => {
        it('should throw an error if there is an error in the body of the method', async () => {
            const provider = new src_1.KMSVeChainProvider({}, { keyId: 'keyId', region: 'region' });
            const signer = new src_1.KMSVeChainSigner(provider);
            await expect(signer.signTransaction({})).rejects.toThrow(sdk_errors_1.SignerMethodError);
        });
    });
    describe('sendTransaction', () => {
        it('should throw an error if there is an error in the body of the method', async () => {
            const provider = new src_1.KMSVeChainProvider({}, { keyId: 'keyId', region: 'region' });
            const signer = new src_1.KMSVeChainSigner(provider);
            await expect(signer.sendTransaction({})).rejects.toThrow(sdk_errors_1.SignerMethodError);
        });
    });
    describe('signMessage', () => {
        it('should throw an error if there is an error in the body of the method', async () => {
            const provider = new src_1.KMSVeChainProvider({}, { keyId: 'keyId', region: 'region' });
            const signer = new src_1.KMSVeChainSigner(provider);
            await expect(signer.signMessage({})).rejects.toThrow(sdk_errors_1.SignerMethodError);
        });
    });
    describe('signTypedData', () => {
        it('should throw an error if there is no provider instance', async () => {
            jest.spyOn(sdk_core_1.Hex, 'of').mockReturnValue(sdk_core_1.Hex.of('0x1'));
            const signer = new src_1.KMSVeChainSigner();
            await expect(signer.signTypedData({
                name: 'Ether Mail',
                version: '1',
                chainId: 1,
                verifyingContract: dummy_data_1.EIP712_CONTRACT
            }, {
                Person: [
                    {
                        name: 'name',
                        type: 'string'
                    },
                    {
                        name: 'wallet',
                        type: 'address'
                    }
                ],
                Mail: [
                    {
                        name: 'from',
                        type: 'Person'
                    },
                    {
                        name: 'to',
                        type: 'Person'
                    },
                    {
                        name: 'contents',
                        type: 'string'
                    }
                ]
            }, {
                from: {
                    name: 'Cow',
                    wallet: dummy_data_1.EIP712_FROM
                },
                to: {
                    name: 'Bob',
                    wallet: dummy_data_1.EIP712_TO
                },
                contents: 'Hello, Bob!'
            }, 'Mail')).rejects.toThrow(sdk_errors_1.SignerMethodError);
        });
        it('should throw an error if there is an error in the body of the method', async () => {
            const provider = new src_1.KMSVeChainProvider({}, { keyId: 'keyId', region: 'region' });
            const signer = new src_1.KMSVeChainSigner(provider);
            await expect(signer.signTypedData({}, {}, {}, 'primaryType')).rejects.toThrow(sdk_errors_1.SignerMethodError);
        });
    });
});
