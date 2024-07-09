// START_SNIPPET: AddressValidationSnippet

import { addressUtils } from '@vechain/sdk-core';
import { expect } from 'expect';

// Valid address
console.log(
    addressUtils.isAddress('0x8617E340B3D01FA5F11F306F4090FD50E238070D')
); // true

// Invalid address
console.log(addressUtils.isAddress('52908400098527886E0F7030069857D2E4169EE7')); // false

// END_SNIPPET: AddressValidationSnippet

expect(
    addressUtils.isAddress('0x8617E340B3D01FA5F11F306F4090FD50E238070D')
).toEqual(true);
expect(
    addressUtils.isAddress('52908400098527886E0F7030069857D2E4169EE7')
).toEqual(false);
