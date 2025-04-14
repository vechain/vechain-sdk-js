export const TESTING_CONTRACT_ADDRESS: string = '0xa6ff3a32e54a29a48600a683c41fab40637b7e98';
export const TESTING_CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "CustomError",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "newValue",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "oldValue",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "StateChanged",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_addressData",
        "type": "address"
      }
    ],
    "name": "addressData",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "balances",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "_boolData",
        "type": "bool"
      }
    ],
    "name": "boolData",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_byteData",
        "type": "bytes32"
      }
    ],
    "name": "bytes32Data",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "calculateBlake2b256",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "_dynamicArrayData",
        "type": "uint256[]"
      }
    ],
    "name": "dynamicArrayData",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum TestingContract.ExampleEnum",
        "name": "_enumData",
        "type": "uint8"
      }
    ],
    "name": "enumData",
    "outputs": [
      {
        "internalType": "enum TestingContract.ExampleEnum",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[3]",
        "name": "_fixedArrayData",
        "type": "uint256[3]"
      }
    ],
    "name": "fixedArrayData",
    "outputs": [
      {
        "internalType": "uint256[3]",
        "name": "",
        "type": "uint256[3]"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blockNum",
        "type": "uint256"
      }
    ],
    "name": "getBlockID",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blockNum",
        "type": "uint256"
      }
    ],
    "name": "getBlockSigner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blockNum",
        "type": "uint256"
      }
    ],
    "name": "getBlockTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blockNum",
        "type": "uint256"
      }
    ],
    "name": "getBlockTotalScore",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTxBlockRef",
    "outputs": [
      {
        "internalType": "bytes8",
        "name": "",
        "type": "bytes8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTxExpiration",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTxID",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTxProvedWork",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "_intData",
        "type": "int256"
      }
    ],
    "name": "intData",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_uintData",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_addressData",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "_byteData",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "_stringData",
        "type": "string"
      },
      {
        "internalType": "uint256[3]",
        "name": "_fixedArrayData",
        "type": "uint256[3]"
      },
      {
        "internalType": "uint256[]",
        "name": "_dynamicArrayData",
        "type": "uint256[]"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          }
        ],
        "internalType": "struct TestingContract.ExampleStruct",
        "name": "_structData",
        "type": "tuple"
      },
      {
        "internalType": "enum TestingContract.ExampleEnum",
        "name": "_enumData",
        "type": "uint8"
      }
    ],
    "name": "multipleData",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256[3]",
        "name": "",
        "type": "uint256[3]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          }
        ],
        "internalType": "struct TestingContract.ExampleStruct",
        "name": "",
        "type": "tuple"
      },
      {
        "internalType": "enum TestingContract.ExampleEnum",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "_uint8Data",
        "type": "uint8"
      },
      {
        "internalType": "uint16",
        "name": "_uint16Data",
        "type": "uint16"
      },
      {
        "internalType": "uint32",
        "name": "_uint32Data",
        "type": "uint32"
      },
      {
        "internalType": "uint64",
        "name": "_uint64Data",
        "type": "uint64"
      },
      {
        "internalType": "uint160",
        "name": "_uint160Data",
        "type": "uint160"
      },
      {
        "internalType": "uint256",
        "name": "_uint256Data",
        "type": "uint256"
      }
    ],
    "name": "multipleIntData",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      },
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      },
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      },
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      },
      {
        "internalType": "uint160",
        "name": "",
        "type": "uint160"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_newValue",
        "type": "uint256"
      }
    ],
    "name": "setStateVariable",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "stateVariable",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_stringData",
        "type": "string"
      }
    ],
    "name": "stringData",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          }
        ],
        "internalType": "struct TestingContract.ExampleStruct",
        "name": "_structData",
        "type": "tuple"
      }
    ],
    "name": "structData",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          }
        ],
        "internalType": "struct TestingContract.ExampleStruct",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "testAssertError",
    "outputs": [],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "testCustomError",
    "outputs": [],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "testInvalidOpcodeError",
    "outputs": [],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "_value",
        "type": "uint8"
      }
    ],
    "name": "testOverflowError",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "testRequireError",
    "outputs": [],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "testRevertError",
    "outputs": [],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_uintData",
        "type": "uint256"
      }
    ],
    "name": "uintData",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
export const TESTING_CONTRACT_BYTECODE: string = '0x608060405234801561001057600080fd5b50600436106102065760003560e01c80636188a79b1161011a578063bd255307116100ad578063da46084a1161007c578063da46084a1461050c578063e1967eae14610531578063eb03555c1461027e578063f8b2cb4f1461053a578063fb3a4b941461056357600080fd5b8063bd255307146104b6578063c4e41b22146104d6578063c7bce69d146104de578063cf98821c146104f157600080fd5b80637634787f116100e95780637634787f14610452578063b2d1440014610465578063b6b55f2514610478578063bd220e651461048b57600080fd5b80636188a79b146103fe5780636765f626146104195780636a98ff2b1461042c57806375f7286c1461043f57600080fd5b80632e1a7d4d1161019d578063448dc9661161016c578063448dc96614610345578063459346c71461027e5780634888df8d146103665780634d56c8731461036e5780635fb5fe3b146103d857600080fd5b80632e1a7d4d146102f9578063339564031461030c5780633793077c1461032a5780633f92958f1461033257600080fd5b806311c4ea65116101d957806311c4ea651461028f57806315a23066146102b65780631d4a06de146102be57806327e235e3146102d957600080fd5b806301cb08c51461020b57806301ec27bd146102205780630a9f3f051461025d5780631083ac921461027e575b600080fd5b61021e610219366004610be7565b610568565b005b61024761022e366004610d32565b6040805180820190915260008152606060208201525090565b6040516102549190610dd3565b60405180910390f35b61027061026b366004610be7565b6105b1565b604051908152602001610254565b61027061028c366004610be7565b90565b6102a261029d366004610f06565b610626565b60405161025498979695949392919061105c565b61027061066d565b6102cc61028c3660046110e2565b6040516102549190611116565b6102706102e7366004611129565b60026020526000908152604090205481565b61021e610307366004610be7565b6106ea565b61031a61028c366004611146565b6040519015158152602001610254565b61027061079a565b610270610340366004610be7565b6107ee565b61034d610820565b6040516001600160c01b03199091168152602001610254565b610270610898565b61038861037c36600461118e565b94959394929391929091565b6040805160ff909716875261ffff909516602087015263ffffffff909316938501939093526001600160401b031660608401526001600160a01b03909116608083015260a082015260c001610254565b6103e661028c366004611129565b6040516001600160a01b039091168152602001610254565b61040c61028c366004611215565b6040516102549190611230565b61021e610427366004610be7565b6108ec565b61027061043a36600461123e565b61093f565b61021e61044d366004610be7565b610970565b6103e6610460366004610be7565b6109b3565b61021e610473366004610be7565b610a21565b61021e610486366004610be7565b610a72565b61049e610499366004610be7565b610ae4565b6040516001600160401b039091168152602001610254565b6104c96104c4366004611286565b610b52565b60405161025491906112a2565b610270610b5a565b61021e6104ec366004610be7565b610bae565b6104ff61028c3660046112b0565b60405161025491906112e4565b61051f61051a3660046112f7565b610bbc565b60405160ff9091168152602001610254565b61027060015481565b610270610548366004611129565b6001600160a01b031660009081526002602052604090205490565b61021efe5b60018054908290556040514281523390829084907f300d5da673e2547b3469e683ff2c8c7efd661c408f45cd0be5a951392a00cfa39060200160405180910390a45050565b5090565b60008054604051631dc0775160e11b8152600481018490526001600160a01b0390911690633b80eea2906024015b602060405180830381865afa1580156105fc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106209190611312565b92915050565b60008060006060610635610bc9565b6060610654604051806040016040528060008152602001606081525090565b509c9d9b9c50999a989950969795965093949293505050565b60008060009054906101000a90046001600160a01b03166001600160a01b031663605df59c6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156106c1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106e59190611312565b905090565b336000908152600260205260409020548111156107455760405162461bcd60e51b8152602060048201526014602482015273496e73756666696369656e742062616c616e636560601b60448201526064015b60405180910390fd5b3360009081526002602052604081208054839290610764908490611341565b9091555050604051339082156108fc029083906000818181858888f19350505050158015610796573d6000803e3d6000fd5b5050565b60008060009054906101000a90046001600160a01b03166001600160a01b031663cbf6ddce6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156106c1573d6000803e3d6000fd5b60008054604051633549f8d160e21b8152600481018490526001600160a01b039091169063d527e344906024016105df565b60008060009054906101000a90046001600160a01b03166001600160a01b031663e80558316040518163ffffffff1660e01b8152600401602060405180830381865afa158015610874573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106e59190611354565b60008060009054906101000a90046001600160a01b03166001600160a01b0316639ac53dbb6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156106c1573d6000803e3d6000fd5b600a811161093c5760405162461bcd60e51b815260206004820152601d60248201527f56616c7565206d7573742062652067726561746572207468616e203130000000604482015260640161073c565b50565b60008054604051630dc9160560e21b81526001600160a01b03909116906337245814906105df908590600401611116565b80602a1461093c576040516346b7545f60e11b815260206004820152600f60248201526e2b30b63ab29034b9903737ba101a1960891b604482015260640161073c565b6000805460405163207cfd7f60e11b8152600481018490526001600160a01b03909116906340f9fafe90602401602060405180830381865afa1580156109fd573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610620919061137e565b600581101561093c5760405162461bcd60e51b815260206004820152601860248201527f56616c7565206d757374206265206174206c6561737420350000000000000000604482015260640161073c565b8060008111610abc5760405162461bcd60e51b815260206004820152601660248201527556616c7565206d75737420626520706f73697469766560501b604482015260640161073c565b3360009081526002602052604081208054849290610adb90849061139b565b90915550505050565b600080546040516341f9072160e01b8152600481018490526001600160a01b03909116906341f9072190602401602060405180830381865afa158015610b2e573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061062091906113ae565b6105ad610bc9565b60008060009054906101000a90046001600160a01b03166001600160a01b03166318160ddd6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156106c1573d6000803e3d6000fd5b801561093c5761093c6113cb565b60006106208260016113e1565b60405180606001604052806003906020820280368337509192915050565b600060208284031215610bf957600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b0381118282101715610c3e57610c3e610c00565b604052919050565b60006001600160401b03831115610c5f57610c5f610c00565b610c72601f8401601f1916602001610c16565b9050828152838383011115610c8657600080fd5b828260208301376000602084830101529392505050565b600082601f830112610cae57600080fd5b610cbd83833560208501610c46565b9392505050565b600060408284031215610cd657600080fd5b604051604081016001600160401b038282108183111715610cf957610cf9610c00565b81604052829350843583526020850135915080821115610d1857600080fd5b50610d2585828601610c9d565b6020830152505092915050565b600060208284031215610d4457600080fd5b81356001600160401b03811115610d5a57600080fd5b610d6684828501610cc4565b949350505050565b6000815180845260005b81811015610d9457602081850181015186830182015201610d78565b506000602082860101526020601f19601f83011685010191505092915050565b805182526000602082015160406020850152610d666040850182610d6e565b602081526000610cbd6020830184610db4565b6001600160a01b038116811461093c57600080fd5b8035610e0681610de6565b919050565b600082601f830112610e1c57600080fd5b604051606081018181106001600160401b0382111715610e3e57610e3e610c00565b604052806060840185811115610e5357600080fd5b845b81811015610e6d578035835260209283019201610e55565b509195945050505050565b600082601f830112610e8957600080fd5b813560206001600160401b03821115610ea457610ea4610c00565b8160051b610eb3828201610c16565b9283528481018201928281019087851115610ecd57600080fd5b83870192505b84831015610eec57823582529183019190830190610ed3565b979650505050505050565b803560038110610e0657600080fd5b600080600080600080600080610140898b031215610f2357600080fd5b88359750610f3360208a01610dfb565b96506040890135955060608901356001600160401b0380821115610f5657600080fd5b610f628c838d01610c9d565b9650610f718c60808d01610e0b565b955060e08b0135915080821115610f8757600080fd5b610f938c838d01610e78565b94506101008b0135915080821115610faa57600080fd5b50610fb78b828c01610cc4565b925050610fc76101208a01610ef7565b90509295985092959890939650565b8060005b6003811015610ff9578151845260209384019390910190600101610fda565b50505050565b600081518084526020808501945080840160005b8381101561102f57815187529582019590820190600101611013565b509495945050505050565b6003811061105857634e487b7160e01b600052602160045260246000fd5b9052565b8881526001600160a01b0388166020820152604081018790526101406060820181905260009061108e83820189610d6e565b905061109d6080840188610fd6565b82810360e08401526110af8187610fff565b90508281036101008401526110c48186610db4565b9150506110d561012083018461103a565b9998505050505050505050565b6000602082840312156110f457600080fd5b81356001600160401b0381111561110a57600080fd5b610d6684828501610c9d565b602081526000610cbd6020830184610d6e565b60006020828403121561113b57600080fd5b8135610cbd81610de6565b60006020828403121561115857600080fd5b81358015158114610cbd57600080fd5b803560ff81168114610e0657600080fd5b6001600160401b038116811461093c57600080fd5b60008060008060008060c087890312156111a757600080fd5b6111b087611168565b9550602087013561ffff811681146111c757600080fd5b9450604087013563ffffffff811681146111e057600080fd5b935060608701356111f081611179565b9250608087013561120081610de6565b8092505060a087013590509295509295509295565b60006020828403121561122757600080fd5b610cbd82610ef7565b60208101610620828461103a565b60006020828403121561125057600080fd5b81356001600160401b0381111561126657600080fd5b8201601f8101841361127757600080fd5b610d6684823560208401610c46565b60006060828403121561129857600080fd5b610cbd8383610e0b565b606081016106208284610fd6565b6000602082840312156112c257600080fd5b81356001600160401b038111156112d857600080fd5b610d6684828501610e78565b602081526000610cbd6020830184610fff565b60006020828403121561130957600080fd5b610cbd82611168565b60006020828403121561132457600080fd5b5051919050565b634e487b7160e01b600052601160045260246000fd5b818103818111156106205761062061132b565b60006020828403121561136657600080fd5b81516001600160c01b031981168114610cbd57600080fd5b60006020828403121561139057600080fd5b8151610cbd81610de6565b808201808211156106205761062061132b565b6000602082840312156113c057600080fd5b8151610cbd81611179565b634e487b7160e01b600052600160045260246000fd5b60ff81811683821601908111156106205761062061132b56fea2646970667358221220aacfa7840ab5da5b092f4ddd2bfea2cf520a06d086e95b043b70366c68dbf39364736f6c63430008140033';
export const SOLO_GENESIS_BLOCK = {
  "number": 0,
  "id": "0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6",
  "size": 170,
  "parentID": "0xffffffff00000000000000000000000000000000000000000000000000000000",
  "timestamp": 1526400000,
  "gasLimit": 10000000,
  "beneficiary": "0x0000000000000000000000000000000000000000",
  "gasUsed": 0,
  "totalScore": 0,
  "txsRoot": "0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0",
  "txsFeatures": 0,
  "stateRoot": "0x93de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550",
  "receiptsRoot": "0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0",
  "com": false,
  "signer": "0x0000000000000000000000000000000000000000",
  "isTrunk": true,
  "isFinalized": true,
  "transactions": []
};
export const SEED_VET_TX_ID: string = '0x48ecbb56b5a0f6014ad71a28e4727752273b92f3da34b53c7dde1dcb2855f0ca';
export const SEED_VTHO_TX_ID: string = '0x9d2d241ebc79f63ac6e4c47ad1813a9e2058596d2e47a6352df07036d0ad1cac';
export const SEED_TEST_TOKEN_TX_ID: string = '0x8b6011ee7803c6cd7bdaa20605f2c96b1754194010e769a09c6ad535c5c14dec';
export const TEST_TOKEN_ADDRESS: string = '0xfc0d3103df2c0a57841348d1bfaea6d1a0eb9234';
