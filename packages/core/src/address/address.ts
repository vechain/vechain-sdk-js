import { ethers } from 'ethers'

/**
 * derive Address from public key, note that the public key is uncompressed
 * @param pub the public key
 */
export function fromPublicKey (pub: Buffer): string {
  return ethers.computeAddress('0x' + pub.toString('hex'))
}

/**
 * to check if a value presents an address
 * @param v the value to be checked
 */
export function test (v: any): v is string {
  return typeof v === 'string' && /^0x[0-9a-f]{40}$/i.test(v)
}

/**
 * encode the address to checksumed address that is compatible with eip-55
 * @param address input address
 */
export function toChecksumed (addr: string): string {
  if (!test(addr)) {
    throw new Error('invalid address')
  }
  return ethers.getAddress(addr)
}

export const address = { fromPublicKey, test, toChecksumed }
