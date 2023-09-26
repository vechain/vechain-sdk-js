import { keccak256 } from '../hash/keccak256'

/**
 * derive Address from public key, note that the public key is uncompressed
 * @param pub the public key
 */
export function fromPublicKey (pub: Buffer): string {
  console.log('pub', pub.toString('hex').slice(1))
  return '0x' + keccak256(pub.slice(1)).slice(12).toString()

  //return "0x" + keccak256(pub.slice(1)).slice(12).toString("hex")
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
  addr = addr.slice(2).toLowerCase()
  const hash = keccak256(addr)

  let checksumed = '0x'
  for (let i = 0; i < addr.length; i++) {
    let byte: number = parseInt(hash[i >> 1])
    if (i % 2 === 0) {
      byte >>= 4
    }

    if (byte % 16 >= 8) {
      checksumed += addr[i].toUpperCase()
    } else {
      checksumed += addr[i]
    }
  }
  return checksumed
}

export const address = { fromPublicKey, test, toChecksumed }
