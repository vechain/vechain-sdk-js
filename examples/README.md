# Examples

The `examples/` directory is a growing & living folder, and open for contributions.  
Each example can be opened in a StackBlitz project, so people can start with the example easily.  

The `examples/thor` directory gives examples using `thor-client` and thor specifics.  
The `examples/viem` directory gives examples using the `viem` compatibility layer. 

## Example List

- Thor
    - Blocks
        - [ ] example 1
        - [ ] example 2
        - [ ] example 3
- Viem
    - Blocks
        - [ ] example 1
        - [ ] example 2
        - [ ] example 3


## Adding an Example

Two templates are provided:

- `_vite_template`: For Vite web based examples
- `_tsx_template`: For executable script examples

Each example must include a `README.md` that explains the example, and gives a "open in Stackblitz" link. 


## Opening in Stackblitz

When you open a project in Stackblitz you will need to update the `package.json` dependency for the SDK to `@vechain/sdk-temp: "latest"`