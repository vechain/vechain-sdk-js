import { Hex, Txt } from '@vechain/sdk-core';
import { JSONRPCInvalidParams, SignerMethodError } from '@vechain/sdk-errors';
import {
    VeChainProvider,
    type ThorClient,
    type TransactionRequestInput
} from '@vechain/sdk-network';
import { type TypedDataDomain, type TypedDataField } from 'ethers';
import { KMSVeChainProvider, KMSVeChainSigner } from '../src';
import { EIP712_CONTRACT, EIP712_FROM, EIP712_TO } from './fixture';
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
            expect(
                () =>
                    new KMSVeChainSigner(
                        new VeChainProvider({} as unknown as ThorClient)
                    )
            ).toThrow(JSONRPCInvalidParams);
        });
    });
    describe('connect', () => {
        it('should break if the provider is not a KMSVeChainProvider', () => {
            const signer = new KMSVeChainSigner();
            expect(() =>
                signer.connect(new VeChainProvider({} as unknown as ThorClient))
            ).toThrow(SignerMethodError);
        });
    });
    describe('getAddress', () => {
        it('should break if there is no provider', async () => {
            const signer = new KMSVeChainSigner();
            await expect(signer.getAddress()).rejects.toThrow(
                SignerMethodError
            );
        });
        it('should break if asn1 decoding fails', async () => {
            const provider = new KMSVeChainProvider(
                {} as unknown as ThorClient,
                { keyId: 'keyId', region: 'region' }
            );
            jest.spyOn(provider, 'getPublicKey').mockResolvedValue(
                Txt.of('publicKey').bytes
            );
            const signer = new KMSVeChainSigner(provider);
            await expect(signer.getAddress()).rejects.toThrow(
                SignerMethodError
            );
        });
    });
    describe('signTransaction', () => {
        it('should throw an error if there is an error in the body of the method', async () => {
            const provider = new KMSVeChainProvider(
                {} as unknown as ThorClient,
                { keyId: 'keyId', region: 'region' }
            );
            const signer = new KMSVeChainSigner(provider);
            await expect(
                signer.signTransaction({} as unknown as TransactionRequestInput)
            ).rejects.toThrow(SignerMethodError);
        });
    });
    describe('sendTransaction', () => {
        it('should throw an error if there is an error in the body of the method', async () => {
            const provider = new KMSVeChainProvider(
                {} as unknown as ThorClient,
                { keyId: 'keyId', region: 'region' }
            );
            const signer = new KMSVeChainSigner(provider);
            await expect(
                signer.sendTransaction({} as unknown as TransactionRequestInput)
            ).rejects.toThrow(SignerMethodError);
        });
    });
    describe('signMessage', () => {
        it('should throw an error if there is an error in the body of the method', async () => {
            const provider = new KMSVeChainProvider(
                {} as unknown as ThorClient,
                { keyId: 'keyId', region: 'region' }
            );
            const signer = new KMSVeChainSigner(provider);
            await expect(
                signer.signMessage({} as unknown as Uint8Array)
            ).rejects.toThrow(SignerMethodError);
        });
    });
    describe('signTypedData', () => {
        it('should throw an error if there is no provider instance', async () => {
            jest.spyOn(Hex, 'of').mockReturnValue(Hex.of('0x1'));
            const signer = new KMSVeChainSigner();
            await expect(
                signer.signTypedData(
                    {
                        name: 'Ether Mail',
                        version: '1',
                        chainId: 1,
                        verifyingContract: EIP712_CONTRACT
                    },
                    {
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
                    },
                    {
                        from: {
                            name: 'Cow',
                            wallet: EIP712_FROM
                        },
                        to: {
                            name: 'Bob',
                            wallet: EIP712_TO
                        },
                        contents: 'Hello, Bob!'
                    }
                )
            ).rejects.toThrow(SignerMethodError);
        });
        it('should throw an error if there is an error in the body of the method', async () => {
            const provider = new KMSVeChainProvider(
                {} as unknown as ThorClient,
                { keyId: 'keyId', region: 'region' }
            );
            const signer = new KMSVeChainSigner(provider);
            await expect(
                signer.signTypedData(
                    {} as unknown as TypedDataDomain,
                    {} as unknown as Record<string, TypedDataField[]>,
                    {} as unknown as Record<string, unknown>
                )
            ).rejects.toThrow(SignerMethodError);
        });
    });
});
