import { InvalidDataType } from '@vechain/sdk-errors';
import { abi, type Address, FPN, type HexUInt, VET } from '../vcdm';
import { Hex } from '../vcdm/Hex';
import { HexInt } from '../vcdm/HexInt';
import { type ClauseOptions, type TransactionClause } from '../transaction';
import type { DeployParams } from './DeployParams';
import type { FunctionFragment } from 'ethers';

class Clause implements TransactionClause {
    private static readonly FORMAT_TYPE = 'json';

    private static readonly NO_VALUE = Hex.PREFIX + '0';

    private static readonly NO_DATA = Hex.PREFIX;

    readonly to: string | null;
    readonly value: string;
    readonly data: string;
    readonly comment?: string;
    readonly abi?: string;

    protected constructor(
        to: string | null,
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

    public amount(): FPN {
        return FPN.of(HexInt.of(this.value).bi);
    }

    public static callFunction(
        contractAddress: Address,
        functionFragment: FunctionFragment,
        args: unknown[],
        amount: VET = VET.of(FPN.ZERO),
        clauseOptions?: ClauseOptions
    ): Clause {
        return new Clause(
            contractAddress.toString().toLowerCase(),
            Hex.PREFIX + amount.wei.toString(Hex.RADIX),
            new abi.Function(functionFragment).encodeInput(args),
            clauseOptions?.comment,
            clauseOptions?.includeABI === true
                ? functionFragment.format(Clause.FORMAT_TYPE)
                : undefined
        );
    }

    public static deployContract(
        contractBytecode: HexUInt,
        deployParams?: DeployParams,
        clauseOptions?: ClauseOptions
    ): Clause {
        const data =
            deployParams !== null && deployParams !== undefined
                ? contractBytecode.digits +
                  abi
                      .encodeParams(deployParams.types, deployParams.values)
                      .replace(Hex.PREFIX, '')
                : contractBytecode.digits;
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
