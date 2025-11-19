import { Address, FixedPointNumber, VET, type ABIFunction, type HexUInt, type Token, type VTHO } from '../vcdm';
import type { ClauseOptions } from './ClauseOptions';
import type { DeployParams } from './DeployParams';
import type { TransactionClause } from './TransactionClause';
/**
 * Represents a contract clause, which includes the clause and the corresponding function ABI.
 */
interface ContractClause {
    clause: TransactionClause;
    functionAbi: ABIFunction;
}
/**
 * This class represent a transaction clause.
 *
 * @extends {TransactionClause}
 */
declare class Clause implements TransactionClause {
    /**
     * Used internally in {@link Clause.callFunction}.
     */
    private static readonly FORMAT_TYPE;
    /**
     * Used internally to tag a transaction without data.
     */
    private static readonly NO_DATA;
    /**
     * Used internally in {@link Clause.transferNFT} method.
     */
    private static readonly TRANSFER_NFT_FUNCTION;
    /**
     * Used internally in {@link Clause.transferVTHOToken} method.
     */
    private static readonly TRANSFER_TOKEN_FUNCTION;
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
     * @see {Clause.transferVTHOToken}
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
     * Used publicly to tag a transaction not tranferring token amount.
     */
    static readonly NO_VALUE: string;
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
    protected constructor(to: string | null, value: string, data: string, comment?: string, abi?: string);
    /**
     * Return the amount of {@link VET} or {@link VTHO} token
     * in {@link Units.wei} to transfer to the destination.
     *
     * @return {FixedPointNumber} The amount as a fixed-point number.
     */
    amount(): FixedPointNumber;
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
    static callFunction(contractAddress: Address, functionAbi: ABIFunction, args: unknown[], amount?: VET, clauseOptions?: ClauseOptions): Clause;
    /**
     * Returns a new clause to deploy a smart contract.
     *
     * @param {HexUInt} contractBytecode - The bytecode of the contract to be deployed.
     * @param {DeployParams} [deployParams] - Optional parameters to pass to the smart contract constructor.
     * @param {ClauseOptions} [clauseOptions] - Optional clause settings.
     * @return {Clause} The clause to deploy the smart contract as part of a transaction.
     */
    static deployContract(contractBytecode: HexUInt, deployParams?: DeployParams, clauseOptions?: ClauseOptions): Clause;
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
    static transferNFT(contractAddress: Address, senderAddress: Address, recipientAddress: Address, tokenId: HexUInt, clauseOptions?: ClauseOptions): ContractClause;
    /**
     * Return a new clause to transfers the specified amount of VTHO
     *
     * @param {Address} recipientAddress - The address of the recipient.
     * @param {VTHO} amount - The amount of token to be transferred.
     * @return {ContractClause} The contract clause to transfer VTHO tokens as part of a transaction.
     * @throws {InvalidDataType} Throws an error if the amount is not a positive integer.
     *
     * @see VTHO.transferTokenTo
     */
    static transferVTHOToken(recipientAddress: Address, amount: VTHO): ContractClause;
    /**
     * Return a new clause to transfer a generic ERC20 Token
     *
     * @param {Address} recipientAddress - The address of the recipient.
     * @param {Token} amount - The amount of token to be transferred.
     * @return {ContractClause} The contract clause to transfer tokens as part of a transaction.
     * @throws {InvalidDataType} Throws an error if the amount is not a positive integer.
     */
    static transferToken(recipientAddress: Address, token: Token): ContractClause;
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
    static transferVET(recipientAddress: Address, amount: VET, clauseOptions?: ClauseOptions): Clause;
}
export { Clause, type ContractClause };
//# sourceMappingURL=Clause.d.ts.map