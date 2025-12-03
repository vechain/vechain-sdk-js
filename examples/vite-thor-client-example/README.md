# Vite Thor Client Example

This example demonstrates how to use the VeChain SDK with Vite in a browser environment.

## Features

- Connects to VeChain Thor testnet
- Retrieves current block information
- Displays block details in the browser
- Uses proper `window.fetch` binding to avoid "Illegal invocation" errors

## Usage

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build
```

Open http://localhost:5173 in your browser to see the example.

## Important Notes

- This example uses `window.fetch.bind(window)` to properly bind the fetch function for browser environments
- The SDK version used is `3.0.0-beta.1.17` from npm
