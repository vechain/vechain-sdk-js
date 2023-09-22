import { ethers } from 'ethers'

/**
 * keccak256 hash function implementation.
 * It uses last version of ethers.js library.
 *
 * @param data Data to hash
 * @returns Hash of data
 */
function keccak256 (data: ethers.BytesLike): string {
  // Data is not bytes-like
  if (ethers.isBytesLike(data)) { return ethers.keccak256(data) }

  // Data is string
  return ethers.keccak256(ethers.toUtf8Bytes(data))
}

export { keccak256 }
