import fastJsonStableStringify from 'fast-json-stable-stringify';
import { Address, Blake2b256, HexUInt, Txt } from '../vcdm';
import { Secp256k1 } from '../secp256k1';
import {
    CertificateSignatureMismatch,
    InvalidDataType
} from '@vechain/sdk-errors';
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

    signature?: string | undefined;

    protected constructor(
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

    protected static encode(object: unknown): Uint8Array {
        return Txt.of(fastJsonStableStringify(object)).bytes;
    }

    public isSigned(): boolean {
        return (
            typeof this.signature === 'string' &&
            HexUInt.isValid(this.signature)
        );
    }

    public static of(data: CertificateData): Certificate {
        try {
            return new Certificate(
                data.purpose,
                data.payload,
                data.domain,
                data.timestamp,
                data.signer,
                data.signature
            );
        } catch (e) {
            throw new InvalidDataType(
                'Certificate.of',
                'invalid certificate data',
                { certifiable: data },
                e
            );
        }
    }

    public sign(privateKey: Uint8Array): this {
        this.signature = undefined;
        this.signature = HexUInt.of(
            Secp256k1.sign(
                Blake2b256.of(Certificate.encode(this)).bytes,
                privateKey
            )
        ).toString();
        return this;
    }

    public verify(): void {
        if (!this.isSigned())
            throw new CertificateSignatureMismatch(
                'Certificate.verify',
                'signature missing',
                { certificate: this }
            );
        const signer = Address.ofPublicKey(
            Secp256k1.recover(
                Blake2b256.of(
                    Certificate.encode({ ...this, signature: undefined })
                ).bytes,
                HexUInt.of(this.signature as string).bytes
            )
        );
        if (signer.toString().toLowerCase() !== this.signer)
            throw new CertificateSignatureMismatch(
                'Certificate.verify',
                "signature doesn't match with signer's public key",
                { certificate: this }
            );
    }
}

export { Certificate };
