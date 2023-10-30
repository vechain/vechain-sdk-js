import { describe, expect, test } from '@jest/globals';
import { SimpleNet } from '../../src';
import { Driver } from '../../src/driver/driver';

describe('Driver', () => {
    // this is just an example, not a real test
    test('test', async () => {
        const net = new SimpleNet('https://testnet.vechain.org');
        const driver = await Driver.connect(net);
        expect(driver).toBe('a'); // should give error
    });
});
