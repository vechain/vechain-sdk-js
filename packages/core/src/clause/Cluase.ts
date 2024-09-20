import { InvalidDataType } from '@vechain/sdk-errors';
import { abi, type Address, type VET } from '../vcdm';
import { Hex } from '../vcdm/Hex';
import { type ClauseOptions, type TransactionClause } from '../transaction';
import type { DeployParams } from './DeployParams';

class Clause implements TransactionClause {
    private static readonly NO_VALUE = 0;

    private static readonly NO_DATA = Hex.PREFIX;

    readonly to: string | null;
    readonly value: string | number;
    readonly data: string;
    readonly comment?: string;
    readonly abi?: string;

    protected constructor(
        to: string | null,
        value: string | number,
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

    public static deployContract(
        contractBytecode: string,
        deployParams?: DeployParams,
        clauseOptions?: ClauseOptions
    ): Clause {
        const data =
            deployParams !== null && deployParams !== undefined
                ? contractBytecode +
                  abi
                      .encodeParams(deployParams.types, deployParams.values)
                      .replace(Hex.PREFIX, '')
                : contractBytecode;
        return new Clause(null, Clause.NO_VALUE, data, clauseOptions?.comment);
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
                Clause.NO_DATA,
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
