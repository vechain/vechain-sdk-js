import { JSONRPCInvalidParams, SignerMethodError } from '@vechain/sdk-errors';
import { VeChainProvider, type ThorClient } from '@vechain/sdk-network';
import { KMSVeChainSigner } from '../src';
jest.mock('asn1js', () => ({
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
        it('should break if asn1 decoding fails', async () => {
            const signer = new KMSVeChainSigner();
            await expect(signer.getAddress()).rejects.toThrow(
                SignerMethodError
            );
        });
    });
});
