import blake from 'blakejs'
import { type ethers } from 'ethers'

/**
 * computes blake2b 256bit hash of given data
 * @param data one or more Buffer | string
 */
function blake2b256 (data: ethers.BytesLike): string {
  // Convert BytesLike to Buffer
  const dataBytesLike = [data] as Array<Buffer | string>

  // Apply blake2b256 hash on buffer
  const ctx = blake.blake2bInit(32)
  dataBytesLike.forEach(d => {
    if (Buffer.isBuffer(d)) {
      blake.blake2bUpdate(ctx, d)
    } else {
      blake.blake2bUpdate(ctx, Buffer.from(d, 'utf8'))
    }
  })
  return `0x${Buffer.from(blake.blake2bFinal(ctx)).toString('hex')}`
}

export { blake2b256 }
