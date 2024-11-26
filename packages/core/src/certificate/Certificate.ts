import fastJsonStableStringify from 'fast-json-stable-stringify';
import { Address, Blake2b256, HexUInt, Txt } from '../vcdm';
import { Secp256k1 } from '../secp256k1';
import {
    CertificateSignatureMismatch,
    InvalidDataType
} from '@vechain/sdk-errors';
import { type CertificateData } from './CertificateData';

/**
 * The Certificate class provides functionality to create, sign, and verify certificates.
 * It implements the CertificateData interface.
 *
 * @remarks
 * The properties of those class are immutable, except {@link signature},
 * because properties are part of the {@link signature} computation.
 * The signature is used of extract and match the {@link signer}.
 * The fact the properties are immutable assure is not possible to create
 * an object tampering properties and carry on the legitimate signature and
 * signer address of the object before tampering to make tampered content
 * to result in a validated certificate.
 *
 * @remarks
 * Classes extending {@link Certificate} should expose immutable properties.
 *
 * @remarks
 * This class implementation supports {@link signer}
 * [mixed-case checksum address encoding](https://eips.ethereum.org/EIPS/eip-55).
 *
 * @implements CertificateData
 */
class Certificate implements CertificateData {
    /**
     * Return the intended use or context of the certificate.
     */
    readonly purpose: string;

    /**
     * Returns the content of the certificate.
     */
    readonly payload: {
        /**
         * Return the description of the type of content.
         */
        readonly type: string;
        /**
         * Return the content serialized as a string.
         */
        readonly content: string;
    };

    /**
     * Return the description of the context of validity of this certificate.
     */
    readonly domain: string;

    /**
     * The value expressed as of milliseconds elapsed since the
     * [epoch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#the_epoch_timestamps_and_invalid_date),
     * when the certificate was issued.
     *
     * @remarks
     * The value is a natural number in the safe integer range of JS `number` type.
     */
    readonly timestamp: number;

    /**
     * Return the address of the entity signed the certificate, as
     * a lowercase hexadecimal expression prefixed by `0x`.
     *
     * @remarks
     * Normalized lowercase prefixed expression is needed because
     * the content of this property is part of the {@signature} computation:
     * certificates made from checksum case address of the signer should
     * result valid as the certificate made from the same signer address
     * not checksum case.
     */
    readonly signer: string;

    /**
     * Return the signature computed evaluating the properties of this object
     * and the private key of the signer.
     *
     * @remarks
     * The signature is a lowercase hexadecimal expression prefixed with `0x`.
     */
    signature?: string;

    /**
     * Returns a new instance of this class assuring the formal validity of the
     * arguments used to build the object.
     *
     * @param {string} purpose - The purpose of the certificate.
     * @param {Object} payload - The payload containing type and content.
     * @param {string} payload.type - The type of the payload.
     * @param {string} payload.content - The content of the payload.
     * @param {string} domain - The domain associated with the certificate.
     * @param {number} timestamp - The time at which the certificate is created;
     * must be a positive safe integer.
     * @param {string} signer - The signer of the certificate;
     * must be a valid address.
     * @param {string|undefined} [signature] - The signature of the certificate;
     * optional parameter.
     *
     * @throws {InvalidDataType} If timestamp is not a positive safe integer.
     * @throws {InvalidDataType} If signer is not a valid address.
     * @throws {InvalidDataType} If signature is invalid.
     *
     * @remarks
     * The `signer` address is represented lowercase and `0x` prefixed.
     */
    protected constructor(
        purpose: string,
        payload: { type: string; content: string },
        domain: string,
        timestamp: number,
        signer: string,
        signature?: string
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

    /**
     * Encodes a given object into a Uint8Array representation
     * applying the following operation to normalize the content:
     * - the properties are sorted in ascending alphabetic order;
     * - the key/value properties are delimited with `"` when serialized as JSON
     *   before to be encoded as bytes;
     * - any not meaningful blank characters are ignored;
     * - the JSON representation of this object is byte encoded using the UTF-8
     *   [normalization form for canonical composition](https://en.wikipedia.org/wiki/Unicode_equivalence#Normal_forms).
     *
     * @param {unknown} object - The input object to be encoded.
     * @return {Uint8Array} The encoded Uint8Array representation of the input object.
     */
    protected static encode(object: unknown): Uint8Array {
        return Txt.of(fastJsonStableStringify(object)).bytes;
    }

    /**
     * Encodes the current certificate instance into a Uint8Array representation.
     *
     * @remarks
     * This method normalizes the content by:
     * - Sorting the properties in ascending alphabetic order.
     * - Delimiting key/value properties with `"` when serialized as JSON before encoding as bytes.
     * - Ignoring any not meaningful blank characters.
     * - Using the UTF-8 normalization form for canonical composition for byte encoding.
     *
     * @return {Uint8Array} The encoded Uint8Array representation of the current certificate instance.
     */
    public encode(): Uint8Array {
        return Certificate.encode({ ...this, signature: undefined });
    }

    /**
     * Return `true` if the current instance has a signature.
     *
     * @return {boolean} `true` if the signature is a valid hexadecimal string,
     * otherwise `false`.
     */
    public isSigned(): boolean {
        return (
            typeof this.signature === 'string' &&
            HexUInt.isValid(this.signature)
        );
    }

    /**
     * Creates a new Certificate instance from the provided CertificateData.
     *
     * @param {CertificateData} data - The data required to create the Certificate.
     * @return {Certificate} A new Certificate instance.
     * @throws {InvalidDataType} If the provided data is invalid:
     * - if timestamp is not a positive safe integer;
     * - if signer is not a valid address;
     * - if signature is an invalid hexadecimal expression.
     *
     * @remarks
     * This method supports {@link signer}
     * [mixed-case checksum address encoding](https://eips.ethereum.org/EIPS/eip-55).
     *
     * @see constructor
     */
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

    /**
     * Signs the current object using a given private key.
     *
     * The {@link signature} is computed encoding this object according
     * the following normalization rules:
     * - the {@link signature} property is ignored, because its value
     *   is the result of this method.
     * - the properties are sorted in ascending alphabetic order;
     * - the key/value properties are delimited with `"` when serialized as JSON
     *   before to be encoded as bytes;
     * - any not meaningful blank characters are ignored;
     * - the JSON representation of this object is byte encoded using the UTF-8
     *   [normalization form for canonical composition](https://en.wikipedia.org/wiki/Unicode_equivalence#Normal_forms).
     *
     * @param {Uint8Array} privateKey - The private key used for signing.
     * @return {this} The current instance after signing.
     *
     * @throws {InvalidOperation} - If a hash error occurs.
     * @throws {InvalidSecp256k1PrivateKey} - If the private key is not a valid 32-byte private key.
     *
     * @remarks Security auditable method, depends on
     * * {@link Blake2b256.of};
     * * {@link Secp256k1.sign}.
     *
     * @see encode
     * @see verify
     */
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

    /**
     * Verifies the certificate by checking its signature.
     *
     * @throws {CertificateSignatureMismatch} if the certificate
     * - is not signed, or
     * - the signature does not match the signer's public key.
     *
     * @remarks
     * This method supports {@link signer}
     * [mixed-case checksum address encoding](https://eips.ethereum.org/EIPS/eip-55).
     *
     * @remarks Security auditable method, depends on
     * * {@link Blake2b256.of};
     * * {@link Secp256k1.recover}.
     */
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
