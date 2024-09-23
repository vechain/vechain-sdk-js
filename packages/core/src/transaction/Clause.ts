import { InvalidDataType } from '@vechain/sdk-errors';
import {
    abi,
    ABIContract,
    FPN,
    VET,
    type ABIFunction,
    type Address,
    type HexUInt,
    type VTHO
} from '../vcdm';
import { Hex } from '../vcdm/Hex';
import { HexInt } from '../vcdm/HexInt';
import { ERC721_ABI, VIP180_ABI } from '../utils';
import { type ClauseOptions, type TransactionClause } from './index';
import type { DeployParams } from './DeployParams';

class Clause implements TransactionClause {
    private static readonly FORMAT_TYPE = 'json';

    private static readonly NO_VALUE = Hex.PREFIX + '0';

    private static readonly NO_DATA = Hex.PREFIX;

    private static readonly TRANSFER_NFT_FUNCTION = 'transferFrom';

    private static readonly TRANSFER_TOKEN_FUNCTION = 'transfer';

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
        functionAbi: ABIFunction,
        args: unknown[],
        amount: VET = VET.of(FPN.ZERO),
        clauseOptions?: ClauseOptions
    ): Clause {
        if (amount.value.isFinite() && amount.value.isPositive()) {
            return new Clause(
                contractAddress.toString().toLowerCase(),
                Hex.PREFIX + amount.wei.toString(Hex.RADIX),
                functionAbi.encodeData(args).toString(),
                clauseOptions?.comment,
                clauseOptions?.includeABI === true
                    ? functionAbi.format(Clause.FORMAT_TYPE)
                    : undefined
            );
        }
        throw new InvalidDataType(
            'Clause.callFunction',
            'not finite positive amount',
            { amount: `${amount.value}` }
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
        return new Clause(
            null,
            Clause.NO_VALUE,
            Hex.PREFIX + data,
            clauseOptions?.comment
        );
    }

    public static transferNFT(
        contractAddress: Address,
        senderAddress: Address,
        recipientAddress: Address,
        tokenId: HexUInt,
        clauseOptions?: ClauseOptions
    ): Clause {
        return Clause.callFunction(
            contractAddress,
            ABIContract.ofAbi(ERC721_ABI).getFunction(
                Clause.TRANSFER_NFT_FUNCTION
            ),
            [
                senderAddress.toString(),
                recipientAddress.toString(),
                tokenId.bi.toString()
            ],
            undefined,
            clauseOptions
        );
    }

    // https://docs.vechain.org/introduction-to-vechain/dual-token-economic-model/vethor-vtho#vip180-vechains-fungible-token-standard
    public static transferToken(
        tokenAddress: Address,
        to: Address,
        amount: VTHO,
        clauseOptions?: ClauseOptions
    ): Clause {
        if (amount.value.isFinite() && amount.value.isPositive()) {
            return this.callFunction(
                tokenAddress,
                ABIContract.ofAbi(VIP180_ABI).getFunction(
                    Clause.TRANSFER_TOKEN_FUNCTION
                ),
                [to.toString(), amount.wei],
                undefined,
                clauseOptions
            );
        }
        throw new InvalidDataType(
            'Clause.transferToken',
            'not positive integer amount',
            { amount: `${amount.value}` }
        );
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
