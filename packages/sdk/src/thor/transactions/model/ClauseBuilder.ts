import { ERC721_ABI, VIP180_ABI } from '@utils';
import {
    FixedPointNumber,
    VET,
    Hex,
    HexInt,
    type Address,
    type HexUInt,
    type VTHO
} from '@vcdm';
import {
    type ClauseOptions,
    type DeployParams,
    type TransactionClause
} from '@thor';
import { IllegalArgumentError } from '@errors';
import { 
    encodeFunctionData, 
    encodeAbiParameters,
    parseAbiParameters,
    type AbiFunction,
    type Abi
} from 'viem';

/**
 * Full Qualified Path
 */
const FQP = 'packages/sdk/src/transaction/Clause.ts!';

/**
 * This class represent a transaction clause.
 *
 * @extends {TransactionClause}
 */
class ClauseBuilder implements TransactionClause {
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
     * @param {Abi} contractAbi - The ABI of the contract.
     * @param {string} functionName - The name of the function to call.
     * @param {unknown[]} args - The arguments for the function.
     * @param {VET} [amount=VET.of(FixedPointNumber.ZERO)] - The amount of VET to be sent with the transaction calling the function.
     * @param {ClauseOptions} [clauseOptions] - Optional clause settings.
     * @return {Clause} A clause object to call the function in a transaction.
     * @throws {IllegalArgumentError} Throws an error if the amount is not a finite positive value.
     */
    public static callFunction(
        contractAddress: Address,
        contractAbi: Abi,
        functionName: string,
        args: unknown[],
        amount: VET = VET.of(FixedPointNumber.ZERO),
        clauseOptions?: ClauseOptions
    ): ClauseBuilder {
        if (amount.value.isFinite() && amount.value.isPositive()) {
            const encodedData = encodeFunctionData({
                abi: contractAbi,
                functionName,
                args
            });

            const functionAbi = contractAbi.find(
                (item: any) => item.type === 'function' && item.name === functionName
            ) as AbiFunction;

            return new ClauseBuilder(
                contractAddress.toString().toLowerCase(),
                Hex.PREFIX + amount.wei.toString(Hex.RADIX),
                encodedData,
                clauseOptions?.comment,
                clauseOptions?.includeABI === true && functionAbi
                    ? JSON.stringify(functionAbi)
                    : undefined
            );
        }
        throw new IllegalArgumentError(
            `${FQP}Clause.callFunction(contractAddress: Address, contractAbi: Abi, functionName: string, args: unknown[], amount: VET): Clause`,
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
     * @return {ClauseBuilder} The clause to deploy the smart contract as part of a transaction.
     */
    public static deployContract(
        contractBytecode: HexUInt,
        deployParams?: DeployParams,
        clauseOptions?: ClauseOptions
    ): ClauseBuilder {
        let data = contractBytecode.digits;
        
        if (deployParams != null && deployParams !== undefined) {
            // Handle both string and AbiParameter[] types
            const abiParams = typeof deployParams.types === 'string' 
                ? parseAbiParameters(deployParams.types)
                : deployParams.types;
                
            const encodedParams = encodeAbiParameters(abiParams, deployParams.values);
            data = contractBytecode.digits + encodedParams.slice(2); // Remove 0x prefix
        }
        
        return new ClauseBuilder(
            null,
            ClauseBuilder.NO_VALUE,
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
     * @return {ClauseBuilder} The clause object representing the transfer operation as part of a transaction.
     */
    public static transferNFT(
        contractAddress: Address,
        senderAddress: Address,
        recipientAddress: Address,
        tokenId: HexUInt,
        clauseOptions?: ClauseOptions
    ): ClauseBuilder {
        return ClauseBuilder.callFunction(
            contractAddress,
            ERC721_ABI,
            ClauseBuilder.TRANSFER_NFT_FUNCTION,
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
     * @return {ClauseBuilder} The clause to transfer VIP180 tokens as part of a transaction.
     * @throws {IllegalArgumentError} Throws an error if the amount is not a positive integer.
     *
     * @see VTHO.transferTokenTo
     */
    public static transferToken(
        tokenAddress: Address,
        recipientAddress: Address,
        amount: VTHO,
        clauseOptions?: ClauseOptions
    ): ClauseBuilder {
        if (amount.value.isFinite() && amount.value.isPositive()) {
            return this.callFunction(
                tokenAddress,
                VIP180_ABI,
                ClauseBuilder.TRANSFER_TOKEN_FUNCTION,
                [recipientAddress.toString(), amount.wei],
                undefined,
                clauseOptions
            );
        }
        throw new IllegalArgumentError(
            `${FQP}Clause.transferToken(tokenAddress: Address, recipientAddress: Address, amount: VTHO): Clause`,
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
     * @throws {IllegalArgumentError} - If the amount is not a finite positive value.
     *
     * @see VET.transferTo
     */
    public static transferVET(
        recipientAddress: Address,
        amount: VET,
        clauseOptions?: ClauseOptions
    ): ClauseBuilder {
        if (amount.value.isFinite() && amount.value.isPositive()) {
            return new ClauseBuilder(
                recipientAddress.toString().toLowerCase(),
                Hex.PREFIX + amount.wei.toString(Hex.RADIX),
                ClauseBuilder.NO_DATA,
                clauseOptions?.comment
            );
        }
        throw new IllegalArgumentError(
            `${FQP}Clause.transferVET(recipientAddress: Address, amount: VET): Clause`,
            'not finite positive amount',
            { amount: `${amount.value}` }
        );
    }
}

export { ClauseBuilder };
