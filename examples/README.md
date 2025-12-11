# Examples

The `examples/` directory is a growing & living folder, and open for contributions.  
Each example can be opened in a StackBlitz project, so people can start with the example easily.  

The `examples/thor` directory gives examples using `thor-client` and thor specifics.  
The `examples/viem` directory gives examples using the `viem` compatibility layer. 

## Example List

- Thor
    - Contracts
        - [Contract deployment using ThorClient and contract bytecode](./thor/contract-deploy-example/)
        - [Execute read-only contract call using ABIContract](./thor/execute-call/)
        - [Write to contract with fee delegation (VIP-191)](./thor/write-contracts-delegation/)
    - Mnemonics and Keys
        - [Mnemonic and HDKey](./thor/mnemonic-hdkey-example/)
    - Accounts
        - [Read an addresses VET & VTHO balance and contract bytecode](./thor/get-account-details/)
    - Transactions
        - [Read a transaction and transaction receipt](./thor/get-transaction-details/)
        - [Transfer VIP-180/ERC-20 tokens without ABI](./thor/transfer-token-wo-abi/)
        - [Request gas sponsorship from the generic delegator (VET, B3TR)](./thor/generic-delegator-tx/)


- Viem
    - Blocks
        - example 1
        - example 2
        - example 3


## Adding an Example

Two templates are provided:

- `_vite_template`: For Vite web based examples
- `_tsx_template`: For executable script examples

Each example must include a `README.md` that explains the example, and gives a "open in Stackblitz" link. 


## Opening in Stackblitz

When you open a project in Stackblitz you will need to update the `package.json` dependency for the SDK to `@vechain/sdk-temp: "latest"`