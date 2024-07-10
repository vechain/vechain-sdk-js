// START_SNIPPET: AddressERC55ChecksumSnippet

import { addressUtils } from '@vechain/sdk-core';
import { expect } from 'expect';

// Address without ERC55 checksum
const unchecksummedAddress =
    '0x8617E340B3D01FA5F11F306F4090FD50E238070D'.toLowerCase();

// Address with ERC55 checksum
const checksummedAddress = addressUtils.toERC55Checksum(unchecksummedAddress);

console.log(checksummedAddress); // 0x8617E340B3D01FA5F11F306F4090FD50E238070D

// END_SNIPPET: AddressERC55ChecksumSnippet

expect(checksummedAddress).toEqual(
    '0x8617E340B3D01FA5F11F306F4090FD50E238070D'
);
