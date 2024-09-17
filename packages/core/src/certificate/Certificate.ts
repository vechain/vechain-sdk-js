import fastJsonStableStringify from 'fast-json-stable-stringify';
import { Address, Blake2b256, HexUInt, Txt } from '../vcdm';
import { Secp256k1 } from '../secp256k1';
import { CertificateSignature, InvalidDataType } from '@vechain/sdk-errors';
import { type CertificateData } from './types';

class Certificate implements CertificateData {
    readonly purpose: string;

    readonly payload: {
        readonly type: string;
        readonly content: string;
    };

    readonly domain: string;
    readonly timestamp: number;
    readonly signer: string;
    readonly signature?: string | undefined;

    constructor(
        purpose: string,
        payload: { type: string; content: string },
        domain: string,
        timestamp: number,
        signer: string,
        signature?: string | undefined
    ) {
        if (Number.isSafeInteger(timestamp) && timestamp >= 0) {
            if (Address.isValid(signer)) {
                this.purpose = purpose;
                this.payload = payload;
                this.domain = domain;
                this.timestamp = timestamp;
                this.signer = signer.toString().toLowerCase();
                try {
                    this.signature =
                        typeof signature === 'string'
                            ? HexUInt.of(signature).alignToBytes().toString()
                            : signature;
                } catch (e) {
                    throw new InvalidDataType(
                        'Certificate.constructor',
                        'invalid signature',
                        { signature },
                        e
                    );
                }
            } else
                throw new InvalidDataType(
                    'Certificate.constructor',
                    'signer is not an address',
                    { signer }
                );
        } else
            throw new InvalidDataType(
                'Certificate.constructor',
                'not positive safe integer timestamp',
                { timestamp }
            );
    }

    protected encode(): Uint8Array {
        return Txt.of(fastJsonStableStringify(this)).bytes;
    }

    public isSigned(): boolean {
        return (
            typeof this.signature === 'string' &&
            HexUInt.isValid(this.signature)
        );
    }

    public static of(certifiable: CertificateData): Certificate {
        try {
            return new Certificate(
                certifiable.purpose,
                certifiable.payload,
                certifiable.domain,
                certifiable.timestamp,
                certifiable.signer,
                certifiable.signature
            );
        } catch (e) {
            throw new InvalidDataType(
                'Certificate.of',
                'invalid certificate data',
                { certifiable },
                e
            );
        }
    }

    public sign(privateKey: Uint8Array): Certificate {
        return new Certificate(
            this.purpose,
            this.payload,
            this.domain,
            this.timestamp,
            this.signer,
            HexUInt.of(
                Secp256k1.sign(Blake2b256.of(this.encode()).bytes, privateKey)
            ).toString()
        );
    }

    public verify(): void {
        if (this.isSigned()) {
            const signer = Address.ofPublicKey(
                Secp256k1.recover(
                    Blake2b256.of(this.encode()).bytes,
                    HexUInt.of(this.signature as string).bytes
                )
            );
            if (signer.toString().toLowerCase() === this.signer) return;
            throw new CertificateSignature(
                'Certificate.verify',
                "signature doesn't match with signer's public key",
                { certificate: this }
            );
        }
        throw new CertificateSignature(
            'Certificate.verify',
            'signature missing',
            { certificate: this }
        );
    }
}

export { Certificate };
