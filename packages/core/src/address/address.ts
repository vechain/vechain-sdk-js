import { ethers } from 'ethers';

/**
 * derive Address from public key, note that the public key is uncompressed
 * @param pub the public key
 */
function fromPublicKey(publicKey: Buffer): string {
    return ethers.computeAddress('0x' + publicKey.toString('hex'));
}

/**
 * to check if a value presents an address
 * @param v the value to be checked
 */
function test(addressToVerify: string): boolean {
    return /^0x[0-9a-f]{40}$/i.test(addressToVerify);
}

/**
 * encode the address to checksumed address that is compatible with eip-55
 * @param address input address
 */
function toChecksumed(address: string): string {
    if (!test(address)) {
        throw new Error('invalid address');
    }
    return ethers.getAddress(address);
}

export const address = { fromPublicKey, test, toChecksumed };
