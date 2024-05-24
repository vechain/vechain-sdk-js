# sdk-nextjs-integration

This is a simple web application built with React and the VeChain SDK that allows users to view transaction history associated with a specific address on the VeChain blockchain.

## Getting Started

Install dependencies:

```bash
yar install
```

Run the development server:

```bash
yarn dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the application.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Features

 - Retrieve and display transaction history for a given address.
 - View details of each transaction, including timestamp, sender, recipient, amount, and transaction ID.

## Usage

 - Enter the VeChain address you want to retrieve transaction history for in the input field.
 - The application will fetch and display the transaction history associated with the provided address.
 - Scroll horizontally to view all columns in the transaction history table.