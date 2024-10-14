# AWS KMS Adapter for VeChain SDK

The AWS KMS Adapter for VeChain SDK provides a secure way to sign transactions using AWS Key Management Service (KMS). This adapter allows you to leverage AWS KMS to manage and protect your private keys, ensuring that sensitive cryptographic operations are performed in a secure environment.

## Features

- **Secure Key Management**: Use AWS KMS to securely manage and protect your private keys.
- **Transaction Signing**: Sign VeChain transactions using keys stored in AWS KMS.
- **Integration with VeChain SDK**: Seamlessly integrate with the VeChain SDK for blockchain interactions.
- **[WIP] Sign and send transactions using a delegator key**: You can specify the key ID of a delegator key to leverage this VeChain feature for signing and sending transactions.

## Installation

To install the AWS KMS Adapter, use the following command:

```sh
yarn add @vechain/sdk-aws-kms-adapter
```

## Test

To run all the tests, including the ones relying on a local instance of Thor Solo + LocalStack, please run:

```bash
yarn test:solo
```

## Usage

To integrate this into your code, depending on how you plan to manage your AWS credentials, you can choose one of the following examples.

Within this repo, you can create a credentials file called `aws-credentials.json` with your custom credentials under the `tests` folder in case you want to give it a try before integrating with your project. A valid format would be as follows:

```json
{
    // AWS KMS keyId (mandatory)
    "keyId": "00000000-0000-0000-0000-000000000000", 
    // AWS region (mandatory)
    "region": "eu-west-1",
    // AWS credentials (optional)
    "credentials": { 
        // AWS access key id (mandatory if credentials)
        "accessKeyId": "test",
        // AWS secret access key (mandatory if credentials)
        "secretAccessKey": "test",
        // AWS session token if SSO is configured (optional)
        "sessionToken": "test"
    },
    // AWS endpoint (optional, to be used locally along with LocalStack)
    "endpoint": "http://localhost:4599"
}
```

### IAM roles

This is the preferred way. If you integrate this library in an app deployed in AWS following with IAM roles, you can just do as follows:

```ts
import { KMSVeChainProvider, KMSVeChainSigner } from '@vechain/sdk-aws-kms-adapter';
import {
    THOR_SOLO_URL,
    ThorClient
} from '@vechain/sdk-network';
    ...

    interface AwsClientParameters {
        keyId: string;
        region: string;
        credentials?: {
            accessKeyId: string;
            secretAccessKey: string;
            sessionToken?: string;
        };
        endpoint?: string;
    }

    ...

    const thorClient = ThorClient.fromUrl(THOR_SOLO_URL);
    const provider = new KMSVeChainProvider(
        thorClient,
        awsClientParameters.keyId,
        awsClientParameters.region
    );
    const signer = new KMSVeChainSigner(provider);
    // Signing typed data as per EIP712
    const signature = await signer.signTypedData(
                typedData.domain,
                typedData.types,
                typedData.data
            );
```

### AWS credentials (SSO)

This way you can connect to your AWS account by using `accessKeyId`, `secretAccessKey` and `sessionToken` if SSO is enabled.

```ts
import { KMSVeChainProvider, KMSVeChainSigner } from '@vechain/sdk-aws-kms-adapter';
import {
    signerUtils,
    THOR_SOLO_URL,
    ThorClient
} from '@vechain/sdk-network';
    ...

    interface AwsClientParameters {
        keyId: string;
        region: string;
        credentials?: {
            accessKeyId: string;
            secretAccessKey: string;
            sessionToken?: string;
        };
        endpoint?: string;
    }

    ...

    const thorClient = ThorClient.fromUrl(THOR_SOLO_URL);
    const provider = new KMSVeChainProvider(
        thorClient,
        awsClientParameters.keyId,
        awsClientParameters.region
        awsClientParameters.credentials
    );
    const signer = new KMSVeChainSigner(provider);
    // Signing and sending a transaction
    const receipt = await signer.sendTransaction(
                signerUtils.transactionBodyToTransactionRequestInput(
                    txBody,
                    originAddress
                )
            );
```

### AWS endpoint (LocalStack)

You can also leverage LocalStack so you can try the library locally. Sample values are included in the file `tests/test-aws-credentials.json`.

```ts
import { KMSVeChainProvider, KMSVeChainSigner } from '@vechain/sdk-aws-kms-adapter';
import {
    THOR_SOLO_URL,
    ThorClient
} from '@vechain/sdk-network';
    ...

    interface AwsClientParameters {
        keyId: string;
        region: string;
        credentials?: {
            accessKeyId: string;
            secretAccessKey: string;
            sessionToken?: string;
        };
        endpoint?: string;
    }

    ...

    const thorClient = ThorClient.fromUrl(THOR_SOLO_URL);
    const provider = new KMSVeChainProvider(
        thorClient,
        awsClientParameters.keyId,
        awsClientParameters.region
        awsClientParameters.credentials
    );
    const signer = new KMSVeChainSigner(provider);
    // Returns the address related to the KMS key
    const address = await signer.getAddress();
```