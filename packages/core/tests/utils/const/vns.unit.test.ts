import { describe, expect, test } from '@jest/globals';
import { VNS_NETWORK_CONFIGURATION, addressUtils } from '../../../src';

/**
 * @group const
 */
describe('const', () => {
    describe('vns', () => {
        describe.each(['main', '0x186aa'])(
            'Network Configuration Tests',
            (network: string) => {
                test(`should configure vnsRegistry for Chain ${network}`, () => {
                    expect(
                        addressUtils.isAddress(
                            VNS_NETWORK_CONFIGURATION[network].registry
                        )
                    ).toEqual(true);
                });

                test(`should configure vnsUtility for Chain ${network}`, () => {
                    expect(
                        addressUtils.isAddress(
                            VNS_NETWORK_CONFIGURATION[network].resolveUtils
                        )
                    ).toEqual(true);
                });
            }
        );
    });
});
