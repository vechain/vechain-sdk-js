# HDNode

Examples of using HDNode


```typescript { name=hdnode, category=example }
    import { HDNode } from '@vechain-sdk/core';
    import { expect } from 'expect';

    const mnemonic = 'denial kitchen pet squirrel other broom bar gas better priority spoil cross';
    const node = HDNode.fromMnemonic(mnemonic.split(' '));
    const childNode = node.derive(0);

    expect(childNode.address).toBe('0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa');

```

