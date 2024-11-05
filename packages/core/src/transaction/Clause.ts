import { InvalidDataType } from '@vechain/sdk-errors';
import { ERC721_ABI, VIP180_ABI } from '../utils';
import {
    ABI,
    ABIContract,
    FixedPointNumber,
    VET,
    type ABIFunction,
    type Address,
    type HexUInt,
    type VTHO
} from '../vcdm';
import { Hex } from '../vcdm/Hex';
import { HexInt } from '../vcdm/HexInt';
import type { ClauseOptions } from './ClauseOptions';
import type { DeployParams } from './DeployParams';
import type { TransactionClause } from './TransactionClause';

/**
 * This class represent a transaction clause.
 *
 * @extends {TransactionClause}
 */
class Clause implements TransactionClause {
    /**
     * Used internally in {@link Clause.callFunction}.
     */
    private static readonly FORMAT_TYPE = 'json';

    /**
     * Used internally to tag a transaction not tranferring token amount.
     */
    private static readonly NO_VALUE = Hex.PREFIX + '0';

    /**
     * Used internally to tag a transaction without data.
     */
    private static readonly NO_DATA = Hex.PREFIX;

    /**
     * Used internally in {@link Clause.transferNFT} method.
     */
    private static readonly TRANSFER_NFT_FUNCTION = 'transferFrom';

    /**
     * Used internally in {@link Clause.transferToken} method.
     */
    private static readonly TRANSFER_TOKEN_FUNCTION = 'transfer';

    /**
     * Represents the address where:
     * - transfer token to, or
     * - invoke contract method on.
     */
    readonly to: string | null;

    /**
     * Return the hexadecimal expression of the amount of VET or VTHO
     * token in {@link Units.wei} to transfer to the destination.
     *
     * @see {Clause.callFunction}
     * @see {Clause.transferToken}
     * @see {Clause.transferVET}
     */
    readonly value: string;

    /**
     * Return the hexadecimal expression of the encoding of the arguments
     * of the called function of a smart contract.
     */
    readonly data: string;

    /**
     * An optional comment to describe the purpose of the clause.
     */
    readonly comment?: string;

    /**
     * An optional  Application Binary Interface (ABI) of the called
     * function of a smart contract.
     */
    readonly abi?: string;

    /**
     * Creates an instance of the class.
     *
     * @param {string|null} to - The address to transfer token
     * or the smart contract to call, can be null.
     * @param {string} value - The token amount being transferred in wei units
     * as hexadecimal expression.
     * @param {string} data - Arguments of the smart contract function called
     * as encoded as a hexadecimal expression
     * @param {string} [comment] - An optional comment.
     * @param {string} [abi] - An optional ABI string.
     */
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

    /**
     * Return the amount of {@link VET} or {@link VTHO} token
     * in {@link Units.wei} to transfer to the destination.
     *
     * @return {FixedPointNumber} The amount as a fixed-point number.
     */
    public amount(): FixedPointNumber {
        return FixedPointNumber.of(HexInt.of(this.value).bi);
    }

    /**
     * Return a new clause to call a function of a smart contract.
     *
     * @param {Address} contractAddress - The address of the smart contract.
     * @param {ABIFunction} functionAbi - The ABI definition of the function to be called.
     * @param {unknown[]} args - The arguments for the function.
     * @param {VET} [amount=VET.of(FixedPointNumber.ZERO)] - The amount of VET to be sent with the transaction calling the function.
     * @param {ClauseOptions} [clauseOptions] - Optional clause settings.
     * @return {Clause} A clause object to call the function in a transaction.
     * @throws {InvalidDataType} Throws an error if the amount is not a finite positive value.
     */
    public static callFunction(
        contractAddress: Address,
        functionAbi: ABIFunction,
        args: unknown[],
        amount: VET = VET.of(FixedPointNumber.ZERO),
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

    /**
     * Returns a new clause to deploy a smart contract.
     *
     * @param {HexUInt} contractBytecode - The bytecode of the contract to be deployed.
     * @param {DeployParams} [deployParams] - Optional parameters to pass to the smart contract constructor.
     * @param {ClauseOptions} [clauseOptions] - Optional clause settings.
     * @return {Clause} The clause to deploy the smart contract as part of a transaction.
     */
    public static deployContract(
        contractBytecode: HexUInt,
        deployParams?: DeployParams,
        clauseOptions?: ClauseOptions
    ): Clause {
        const data =
            deployParams != null && deployParams !== undefined
                ? contractBytecode.digits +
                  ABI.of(deployParams.types, deployParams.values)
                      .toHex()
                      .toString()
                      .replace(Hex.PREFIX, '')
                : contractBytecode.digits;
        return new Clause(
            null,
            Clause.NO_VALUE,
            Hex.PREFIX + data,
            clauseOptions?.comment
        );
    }

    /**
     * Transfers an NFT from the sender to the recipient.
     *
     * @param {Address} contractAddress - The address of the NFT contract.
     * @param {Address} senderAddress - The address of the current owner (sender) of the NFT.
     * @param {Address} recipientAddress - The address of the new owner (recipient) of the NFT.
     * @param {HexUInt} tokenId - The unique identifier of the NFT to be transferred.
     * @param {ClauseOptions} [clauseOptions] - Optional clause settings.
     * @return {Clause} The clause object representing the transfer operation as part of a transaction.
     */
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

    /**
     * Return a new clause to transfers the specified amount of
     * [VIP180](https://docs.vechain.org/introduction-to-vechain/dual-token-economic-model/vethor-vtho#vip180-vechains-fungible-token-standard)
     * token.
     *
     * @param {Address} tokenAddress - The address of the VIP180 token.
     * @param {Address} recipientAddress - The address of the recipient.
     * @param {VTHO} amount - The amount of token to be transferred.
     * @param {ClauseOptions} [clauseOptions] - Optional clause settings.
     * @return {Clause} The clause to transfer VIP180 tokens as part of a transaction.
     * @throws {InvalidDataType} Throws an error if the amount is not a positive integer.
     *
     * @see VTHO.transferTokenTo
     */
    public static transferToken(
        tokenAddress: Address,
        recipientAddress: Address,
        amount: VTHO,
        clauseOptions?: ClauseOptions
    ): Clause {
        if (amount.value.isFinite() && amount.value.isPositive()) {
            return this.callFunction(
                tokenAddress,
                ABIContract.ofAbi(VIP180_ABI).getFunction(
                    Clause.TRANSFER_TOKEN_FUNCTION
                ),
                [recipientAddress.toString(), amount.wei],
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

    /**
     * Return a new clause to transfers VET to a specified recipient address.
     *
     * @param {Address} recipientAddress - The address of the recipient.
     * @param {VET} amount - The amount of VET to transfer.
     * @param {ClauseOptions} [clauseOptions] - Optional clause settings.
     * @return {Clause} - The clause object to transfer VET as part of a transaction.
     * @throws {InvalidDataType} - If the amount is not a finite positive value.
     *
     * @see VET.transferTo
     */
    public static transferVET(
        recipientAddress: Address,
        amount: VET,
        clauseOptions?: ClauseOptions
    ): Clause {
        if (amount.value.isFinite() && amount.value.isPositive()) {
            return new Clause(
                recipientAddress.toString().toLowerCase(),
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
