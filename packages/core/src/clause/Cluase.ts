import { InvalidDataType } from '@vechain/sdk-errors';
import { type Address, Hex, type VET } from '../vcdm';
import { type ClauseOptions, type TransactionClause } from '../transaction';

class Clause implements TransactionClause {
    to: string | null;
    value: string | number;
    data: string;
    comment?: string;
    abi?: string;

    constructor(
        to: string,
        value: string,
        data: string,
        comment?: string,
        abi?: string
    ) {
        this.to = to;
        this.value = value;
        this.data = data;
        this.comment = comment;
        this.abi = abi;
    }

    public static transferVET(
        to: Address,
        amount: VET,
        clauseOptions?: ClauseOptions
    ): Clause {
        if (amount.value.isFinite() && amount.value.isPositive()) {
            return new Clause(
                to.toString().toLowerCase(),
                Hex.PREFIX + amount.wei.toString(Hex.RADIX),
                Hex.PREFIX,
                clauseOptions?.comment
            );
        }
        throw new InvalidDataType(
            'Clause.transferVET',
            'not finite positive amount',
            { amount: `${amount.value}` }
        );
    }
}

export { Clause };
