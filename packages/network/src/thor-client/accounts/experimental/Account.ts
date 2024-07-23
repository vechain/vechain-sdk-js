import { Address } from '@vechain/sdk-core/src/address/experimental/Address';
import { type ThorClient } from '../../thor-client';
import { buildQuery, thorest } from '../../../utils';
import { type AccountDetail } from '../types';
import { HEX } from '@vechain/sdk-core';

class Account extends Address {
    public async poll(thorClient: ThorClient): Promise<AccountPoll> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const accountDetail: AccountDetail = (await thorClient.httpClient.http(
            'GET',
            thorest.accounts.get.ACCOUNT_DETAIL(this.toString()),
            {
                query: buildQuery({})
            }
        )) as AccountDetail;
        return new AccountPoll(
            this.hex,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
            new HEX(accountDetail.balance).bi,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
            new HEX(accountDetail.energy).bi,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
            accountDetail.hasCode
        );
    }
}

class AccountPoll extends Account {
    public readonly balance: bigint;

    public readonly energy: bigint;

    public readonly hasCode: boolean;

    constructor(
        hex: string,
        balance: bigint,
        energy: bigint,
        hasCode: boolean
    ) {
        super(hex);
        this.balance = balance;
        this.energy = energy;
        this.hasCode = hasCode;
    }
}

export { Account, AccountPoll };
