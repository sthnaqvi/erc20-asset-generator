var web3,
    provider,
    isMainNetwork,
    isRopsten,
    isRinkeby,
    isGoerli,
    isMetaMaskLocked,
    address,
    tokenAddress,
    tokenInteractive;

// abi of StandardToken.sol
var abi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address[]"
            },
            {
                "name": "_addedValue",
                "type": "uint256[]"
            }
        ],
        "name": "multiIncreaseApproval",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "burn",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address[]"
            },
            {
                "name": "_value",
                "type": "uint256[]"
            }
        ],
        "name": "multiApprove",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "standard",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_subtractedValue",
                "type": "uint256"
            }
        ],
        "name": "decreaseApproval",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address[]"
            },
            {
                "name": "_subtractedValue",
                "type": "uint256[]"
            }
        ],
        "name": "multiDecreaseApproval",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            },
            {
                "name": "_extraData",
                "type": "bytes"
            }
        ],
        "name": "approveAndCall",
        "outputs": [
            {
                "name": "success",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_addedValue",
                "type": "uint256"
            }
        ],
        "name": "increaseApproval",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "initialSupply",
                "type": "uint256"
            },
            {
                "name": "tokenName",
                "type": "string"
            },
            {
                "name": "decimalUnits",
                "type": "uint8"
            },
            {
                "name": "tokenSymbol",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
];

// bytecode of StandardToken.sol
var bytecode = '60806040526040805190810160405280600581526020017f4552433230000000000000000000000000000000000000000000000000000000815250600290805190602001906200005192919062000184565b503480156200005f57600080fd5b506040516200247b3803806200247b83398101806040528101908080519060200190929190805182019291906020018051906020019092919080518201929190505050836000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508360068190555082600390805190602001906200010492919062000184565b5080600490805190602001906200011d92919062000184565b5081600560006101000a81548160ff021916908360ff16021790555033600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050505062000233565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620001c757805160ff1916838001178555620001f8565b82800160010185558215620001f8579182015b82811115620001f7578251825591602001919060010190620001da565b5b5090506200020791906200020b565b5090565b6200023091905b808211156200022c57600081600090555060010162000212565b5090565b90565b61223880620002436000396000f300608060405260043610610107576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063035f057d1461010c57806306fdde03146101cd578063095ea7b31461025d57806318160ddd146102c257806323b872dd146102ed578063313ce5671461037257806342966c68146103a357806350e8587e146103d05780635a3b7e4214610491578063661884631461052157806370a082311461058657806372a7b8ba146105dd5780638da5cb5b1461069e57806395d89b41146106f5578063a0712d6814610785578063a9059cbb146107b2578063cae9ca5114610817578063d73dd623146108c2578063dd62ed3e14610927575b600080fd5b34801561011857600080fd5b506101b3600480360381019080803590602001908201803590602001908080602002602001604051908101604052809392919081815260200183836020028082843782019150505050505091929192908035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919291929050505061099e565b604051808215151515815260200191505060405180910390f35b3480156101d957600080fd5b506101e2610c3b565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610222578082015181840152602081019050610207565b50505050905090810190601f16801561024f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561026957600080fd5b506102a8600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610cd9565b604051808215151515815260200191505060405180910390f35b3480156102ce57600080fd5b506102d7610dcb565b6040518082815260200191505060405180910390f35b3480156102f957600080fd5b50610358600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610dd1565b604051808215151515815260200191505060405180910390f35b34801561037e57600080fd5b5061038761118b565b604051808260ff1660ff16815260200191505060405180910390f35b3480156103af57600080fd5b506103ce6004803603810190808035906020019092919050505061119e565b005b3480156103dc57600080fd5b506104776004803603810190808035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919291929080359060200190820180359060200190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509192919290505050611249565b604051808215151515815260200191505060405180910390f35b34801561049d57600080fd5b506104a66113c5565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156104e65780820151818401526020810190506104cb565b50505050905090810190601f1680156105135780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561052d57600080fd5b5061056c600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611463565b604051808215151515815260200191505060405180910390f35b34801561059257600080fd5b506105c7600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506116f4565b6040518082815260200191505060405180910390f35b3480156105e957600080fd5b50610684600480360381019080803590602001908201803590602001908080602002602001604051908101604052809392919081815260200183836020028082843782019150505050505091929192908035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919291929050505061173c565b604051808215151515815260200191505060405180910390f35b3480156106aa57600080fd5b506106b3611a9d565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561070157600080fd5b5061070a611ac3565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561074a57808201518184015260208101905061072f565b50505050905090810190601f1680156107775780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561079157600080fd5b506107b060048036038101908080359060200190929190505050611b61565b005b3480156107be57600080fd5b506107fd600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611bb0565b604051808215151515815260200191505060405180910390f35b34801561082357600080fd5b506108a8600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050611dcf565b604051808215151515815260200191505060405180910390f35b3480156108ce57600080fd5b5061090d600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611f52565b604051808215151515815260200191505060405180910390f35b34801561093357600080fd5b50610988600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061214e565b6040518082815260200191505060405180910390f35b600080825184511415156109b157600080fd5b600090505b835181111515610c3057610a7d83828151811015156109d157fe5b90602001906020020151600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008785815181101515610a2a57fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546121d590919063ffffffff16565b600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008684815181101515610acc57fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508381815181101515610b2257fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008886815181101515610bc957fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546040518082815260200191505060405180910390a380806001019150506109b6565b600191505092915050565b60038054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610cd15780601f10610ca657610100808354040283529160200191610cd1565b820191906000526020600020905b815481529060010190602001808311610cb457829003601f168201915b505050505081565b600081600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b60065481565b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614151515610e0e57600080fd5b6000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548211151515610e5b57600080fd5b600860008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548211151515610ee657600080fd5b610f37826000808773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546121f390919063ffffffff16565b6000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610fca826000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546121d590919063ffffffff16565b6000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061109b82600860008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546121f390919063ffffffff16565b600860008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190509392505050565b600560009054906101000a900460ff1681565b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541115156111ea57600080fd5b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055508060066000828254039250508190555050565b6000808251845114151561125c57600080fd5b600090505b8351811115156113ba57828181518110151561127957fe5b90602001906020020151600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600086848151811015156112d257fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550838181518110151561132857fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925858481518110151561138e57fe5b906020019060200201516040518082815260200191505060405180910390a38080600101915050611261565b600191505092915050565b60028054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561145b5780601f106114305761010080835404028352916020019161145b565b820191906000526020600020905b81548152906001019060200180831161143e57829003601f168201915b505050505081565b600080600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905080831115611574576000600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550611608565b61158783826121f390919063ffffffff16565b600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b8373ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546040518082815260200191505060405180910390a3600191505092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60008060008351855114151561175157600080fd5b600091505b845182111515611a9157600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600086848151811015156117af57fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905080848381518110151561180557fe5b9060200190602002015111156118b3576000600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000878581518110151561186657fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550611975565b6118dd84838151811015156118c457fe5b90602001906020020151826121f390919063ffffffff16565b600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000878581518110151561192c57fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b848281518110151561198357fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008987815181101515611a2a57fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546040518082815260200191505060405180910390a38180600101925050611756565b60019250505092915050565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60048054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611b595780601f10611b2e57610100808354040283529160200191611b59565b820191906000526020600020905b815481529060010190602001808311611b3c57829003601f168201915b505050505081565b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555050565b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614151515611bed57600080fd5b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548211151515611c3a57600080fd5b611c8b826000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546121f390919063ffffffff16565b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550611d1e826000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546121d590919063ffffffff16565b6000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905092915050565b600080849050611ddf8585610cd9565b15611f49578073ffffffffffffffffffffffffffffffffffffffff16638f4ffcb1338630876040518563ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001828103825283818151815260200191508051906020019080838360005b83811015611ed9578082015181840152602081019050611ebe565b50505050905090810190601f168015611f065780820380516001836020036101000a031916815260200191505b5095505050505050600060405180830381600087803b158015611f2857600080fd5b505af1158015611f3c573d6000803e3d6000fd5b5050505060019150611f4a565b5b509392505050565b6000611fe382600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546121d590919063ffffffff16565b600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546040518082815260200191505060405180910390a36001905092915050565b6000600860008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b60008082840190508381101515156121e957fe5b8091505092915050565b600082821115151561220157fe5b8183039050929150505600a165627a7a723058204be9644cd46f3f3302289eb370f0bd709a854cdaae74ee2f0a5cf2b1fbde13180029';

var metamaskStatus = $('#metamask-status');
var accountAddress = $('#current-address');
var currentNetwork = $('#current-network');
var metamaskLocked = $('#metamask-locked');
var metamaskUnlocked = $('#metamask-unlocked');

var tokenInteractive = $('#token-interactive');
tokenInteractive.hide();

var assetForm = $('#asset-form');
var assetFormInput = $('#asset-form :input');

var mintForm = $('#mint-form');
var mintFormInput = $('#mint-form :input');

var transferForm = $('#transfer-form');
var transferFormInput = $('#transfer-form :input');

var burnForm = $('#burn-form');
var burnFormInput = $('#burn-form :input');

//disable all form input fields
assetFormInput.prop("disabled", true);

window.addEventListener('load', async () => {
    // New ethereum provider
    if (window.ethereum) {
        console.log("New ethereum provider detected");
        // Instance web3 with the provided information
        web3 = new Web3(window.ethereum);
        // ask user for permission
        metamaskStatus
            .html('Please allow MetaMask to view your addresses')
            .css({
                "text-align": "center",
                "color": "#0000ff"
            })
            .show();
        window.ethereum.enable().then(function (abc) {
            // user approved permission
            console.log("abc ===>", abc)
            start()
        }).catch(function (error) {
            metamaskStatus.css({ "color": "#ff0000" })
            // user rejected permission
            if (error.code == 4001) {
                metamaskStatus.html('You reject the permission request, Please refresh to try again');
                console.log("User rejected the permission request.");
            } else if (error.code == -32002) {
                metamaskStatus.html("Metamask permission request is already pending</br>Open Metamask to allow")
                    .css({ "color": "#ffa500" });
            } else {
                metamaskStatus.html(error.message);
                console.error("Error while try to connect with Metamask", error);
            }
        });
    }
    // Old web3 provider
    else if (web3 && Object.keys(web3).length) {
        console.log("Old web3 provider detected");
        start()
        // no need to ask for permission
    }
    // No web3 provider
    else {
        console.log('No web3 provider detected || web3 not exits');
        metamaskStatus.html('You do not appear to be connected to any Ethereum network. To use this service and deploy your contract, we recommend using the <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en">MetaMask</a> plugin for Google Chrome, which allows your web browser to connect to an Ethereum network.').show();
    }
});

function renderTokenInteractive(newTokenAddress, isInit) {
    tokenInteractive.show();
    tokenAddress = newTokenAddress;
    tokenAddressText.innerHTML = `<b>${newTokenAddress}</b>`;

    if(!isInit) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('tokenAddress', newTokenAddress);
        window.location.search = urlParams;
    }
}

function handleAccountsChanged(accounts) {
    // Handle the new accounts, or lack thereof.
    // "accounts" will always be an array, but it can be empty.
}

function handleChainChanged(_chainId) {
    // Handle the new chain.
    // Correctly handling chain changes can be complicated.
    // We recommend reloading the page unless you have good reason not to.
    window.location.reload();
}

function metamaskEvents() {
    ethereum.on('accountsChanged', handleAccountsChanged)
        .on('chainChanged', handleChainChanged)
        .on('connect', function (a, b, c) {
            debugger;
        })
        .on('disconnect', function (a, b, c) {
            debugger;
        })
        .on('message', function (a, b, c) {
            debugger;
        });
}

function start() {
    provider = web3.currentProvider;
    assetFormInput.prop("disabled", false);
    metamaskStatus.hide()
    // metamaskEvents()
    getEthNetworkId()
        .then(function (networkId) {
            if (networkId === '1') {
                isMainNetwork = true;
                currentNetwork.text('You are currently at Mainnet').show();
            } else if (networkId === '3') {
                isRopsten = true;
                currentNetwork.text('Your are currently at Ropsten testnet.').show();
            } else if (networkId === '4') {
                isRinkeby = true;
                currentNetwork.text('Your are currently at Rinkeby testnet.').show();
            } else if (networkId === '5') {
                isGoerli = true;
                currentNetwork.text('Your are currently at Goerli testnet.').show();
            } else
                currentNetwork.text('Your current network id is ' + networkId).show();
        })
        .fail(function (err) {
            console.log(err)
        });

    setInterval(function () {
        isLocked()
            .then(function (isLocked) {
                if (isLocked) {
                    isMetaMaskLocked = true;
                    metamaskUnlocked.hide();
                    accountAddress.hide();
                    metamaskLocked.show();
                    assetFormInput.prop("disabled", true);
                    throw Error("Metamask Locked");
                }
                metamaskUnlocked.show();
                metamaskLocked.hide();

                return getAccount()
            })
            .then(function (account) {
                if (account.length > 0) {
                    if (isMetaMaskLocked) {
                        isMetaMaskLocked = false;
                        assetFormInput.prop("disabled", false);
                    }
                    address = account[0];
                    return getBalance(account[0]);
                }
            })
            .then(function (balance) {
                accountAddress.html('<strong>Selected Account: ' + address + ' (' + balance + ' eth)</strong>').show();
            })
            .fail(function (err) {
                if (err.message !== "Metamask Locked")
                    console.log(err)
            });
    }, 1000);


    const searchParams = new URLSearchParams(window.location.search);
    const tokenAddressParam = searchParams.get('tokenAddress');
    if(tokenAddressParam) renderTokenInteractive(tokenAddressParam, true);
}

function sendSync(params) {
    var defer = $.Deferred();
    provider.sendAsync(params, function (err, result) {
        if (err)
            return defer.reject(err.json());
        if (result['error'])
            return defer.reject(result['error']);
        defer.resolve(result)
    }
    );
    return defer.promise();
}

function getEthNetworkId() {
    return sendSync({ method: 'net_version', params: [] })
        .then(function (result) {
            return result['result'];
        })
        .fail(function (err) {
            return err
        })
}

function requestAccounts() {
    return sendSync({ method: 'eth_requestAccounts' })
        .then(function (result) {
            return result['result'];
        })
        .fail(function (err) {
            return err;
        })
}

function getAccount() {
    return sendSync({ method: 'eth_accounts', params: [] })
        .then(function (result) {
            return result['result'];
        })
        .fail(function (err) {
            return err;
        })
}

function getBalance(address) {
    return sendSync({ method: 'eth_getBalance', params: [address] })
        .then(function (result) {
            return web3.utils.fromWei(result['result']);
        })
        .fail(function (err) {
            return err;
        })
}

function isLocked() {
    return getAccount()
        .then(function (accounts) {
            return accounts.length <= 0;
        })
        .fail(function (err) {
            return err
        });
}

//call function on form submit
assetForm.submit(function (e) {

    //prevent the form from actually submitting.
    e.preventDefault();

    var initialSupply = $('#total-supply').val();
    var tokenName = $('#name').val();
    var decimalUnits = $('#decimals').val();
    var tokenSymbol = $('#symbol').val();


    if (tokenName === '') {
        alert('name can\'t be blank')
    } else if (tokenSymbol === '') {
        alert('symbol can\'t be blank')
    } else if (decimalUnits === '') {
        alert('decimals can\'t be blank')
    } else if (initialSupply === '') {
        alert('totalSupply can\'t be blank')
    } else {
        //disable all form input fields
        assetFormInput.prop("disabled", true);
        statusText.innerHTML = 'Waiting for contract to be deployed...';
        var standardtokenContract = new web3.eth.Contract(abi);
        standardtokenContract.deploy({
            data: '0x' + bytecode,
            arguments: [initialSupply, tokenName, decimalUnits, tokenSymbol]
        }).send({
            from: address
        }, function (error, transactionHash) {
            if (error) {
                console.error(error);
                assetFormInput.prop("disabled", false);
                return;
            }
            console.log('Transaction Hash :', transactionHash);
            if (isMainNetwork) {
                statusText.innerHTML = '<p align="center">Contract deployment is in progress - please be patient. If nothing happens for a while check if there\'s any errors in the console (hit F12).<br> <strong>Transaction hash: </strong><br> <a href="https://etherscan.io/tx/' + transactionHash + '" target="_blank">' + transactionHash + '</a></p>'
            } else if (isRopsten) {
                statusText.innerHTML = '<p align="center">Contract deployment is in progress - please be patient. If nothing happens for a while check if there\'s any errors in the console (hit F12). <br> <strong>Transaction hash: </strong><br> <a href="https://ropsten.etherscan.io/tx/' + transactionHash + '" target="_blank">' + transactionHash + '</a></p>'
            } else if (isRinkeby) {
                statusText.innerHTML = '<p align="center">Contract deployment is in progress - please be patient. If nothing happens for a while check if there\'s any errors in the console (hit F12). <br> <strong> Transaction hash: </strong><br> <a href="https://rinkeby.etherscan.io/tx/' + transactionHash + '" target="_blank">' + transactionHash + '</a></p>'
            } else if (isGoerli) {
                statusText.innerHTML = '<p align="center">Contract deployment is in progress - please be patient. If nothing happens for a while check if there\'s any errors in the console (hit F12). <br> <strong> Transaction hash: </strong><br> <a href="https://goerli.etherscan.io/tx/' + transactionHash + '" target="_blank">' + transactionHash + '</a></p>'
            } else
                statusText.innerHTML = 'Contract deployment is in progress - please be patient. If nothing happens for a while check if there\'s any errors in the console (hit F12). Transaction hash: ' + transactionHash
        }).on('confirmation', function () {
            return;
        }).then(function (newContractInstance) {
            if (!newContractInstance.options.address) {
                console.log(newContractInstance);
                return;
            }
            console.log('Deployed Contract Address : ', newContractInstance.options.address);
            var newContractAddress = newContractInstance.options.address;
           
            if (isMainNetwork) {
                statusText.innerHTML = 'Transaction  mined! Contract address: <a href="https://etherscan.io/token/' + newContractAddress + '" target="_blank">' + newContractAddress + '</a>'
            } else if (isRopsten) {
                statusText.innerHTML = 'Transaction  mined! Contract address: <a href="https://ropsten.etherscan.io/token/' + newContractAddress + '" target="_blank">' + newContractAddress + '</a>'
            } else if (isRinkeby) {
                statusText.innerHTML = 'Transaction  mined! Contract address: <a href="https://rinkeby.etherscan.io/token/' + newContractAddress + '" target="_blank">' + newContractAddress + '</a>'
            } else if (isGoerli) {
                statusText.innerHTML = 'Transaction  mined! Contract address: <a href="https://goerli.etherscan.io/token/' + newContractAddress + '" target="_blank">' + newContractAddress + '</a>'
            } else
                statusText.innerHTML = 'Contract deployed at address <b>' + newContractAddress + '</b> - keep a record of this.'

            renderTokenInteractive(newContractAddress, false)
        }).catch(function (error) {
            console.error(error);
            assetFormInput.prop("disabled", false);
        })
    }
});

function nthRoot(x, n) {
    if (x < 0 && n % 2 != 1) return NaN; // Not well defined
    return (x < 0 ? -1 : 1) * Math.pow(Math.abs(x), 1 / n);
}

$("#decimals").keypress(function (e) {
    //if the letter is not digit then display error and don't type anything
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        //display error message
        $("#decimals-error-msg").html("Digits Only").show().fadeOut("slow");
        return false;
    }
});

$("#total-supply").keypress(function (e) {
    //if the letter is not digit then display error and don't type anything
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        //display error message
        $("#total-supply-error-msg").html("Digits Only").show().fadeOut("slow");
        return false;
    } else {
        //TODO:show token total supply will be on bottom of total supply input
        // $("#total-supply").keyup(function (e) {
        //     if ($("#decimals").val() && $('#total-supply').val()) {
        //         console.log(Math.trunc($('#total-supply').val() / Math.pow(10, $("#decimals").val()))
        //     }
        // })
    }
});

function getTransactionHashText(transactionHash) {
    if (isMainNetwork) {
        return '<strong>Please wait a while... Transaction hash: </strong><br> <a href="https://etherscan.io/tx/' + transactionHash + '" target="_blank">' + transactionHash + '</a>'
    } else if (isRopsten) {
        return '<strong>Please wait a while... Transaction hash: </strong><br> <a href="https://ropsten.etherscan.io/tx/' + transactionHash + '" target="_blank">' + transactionHash + '</a>'
    } else if (isRinkeby) {
        return '<strong>Please wait a while... Transaction hash: </strong><br> <a href="https://rinkeby.etherscan.io/tx/' + transactionHash + '" target="_blank">' + transactionHash + '</a>'
    } else if (isGoerli) {
        return '<strong>Please wait a while... Transaction hash: </strong><br> <a href="https://goerli.etherscan.io/tx/' + transactionHash + '" target="_blank">' + transactionHash + '</a>'
    } else return '<strong>Please wait a while... Transaction hash: </strong>' + transactionHash
}


mintForm.submit(function (e) {
    e.preventDefault();
    var amount = $('#mint-amount').val();
    if(!amount) alert('Amount can\'t be blank');
    else {
        mintFormInput.prop("disabled", true);
        mintStatusText.innerHTML = 'Please confirm transaction ...';

        var tokenContract = new web3.eth.Contract(abi, tokenAddress);
        tokenContract.methods.mint(amount).send({
            from: address
        }, function (error, transactionHash) {
            if (error) {
                console.error(error);
                mintFormInput.prop("disabled", false);
                return;
            }
            mintStatusText.innerHTML = getTransactionHashText(transactionHash);
        }).on('confirmation', function () {
            return;
        }).then(function (data) {
            mintFormInput.prop("disabled", false);
            mintStatusText.innerHTML = 'Mint successfully!';
        }).catch(function (error) {
            console.error(error);
            mintFormInput.prop("disabled", false);
        });
    };
});

transferForm.submit(function (e) {
    e.preventDefault();
    var amount = $('#transfer-amount').val();
    var recipient = $('#transfer-recipient').val();
    if(!amount) alert('Amount can\'t be blank');
    else if(!recipient) alert('Recipient can\'t be blank');
    else {
        transferFormInput.prop("disabled", true);
        transferStatusText.innerHTML = 'Please confirm transaction ...';

        var tokenContract = new web3.eth.Contract(abi, tokenAddress);
        tokenContract.methods.transfer(recipient, amount).send({
            from: address
        }, function (error, transactionHash) {
            if (error) {
                console.error(error);
                transferFormInput.prop("disabled", false);
                return;
            }
            transferStatusText.innerHTML = getTransactionHashText(transactionHash);
        }).on('confirmation', function () {
            return;
        }).then(function (data) {
            transferFormInput.prop("disabled", false);
            transferStatusText.innerHTML = 'Transfer successfully!';
        }).catch(function (error) {
            console.error(error);
            transferFormInput.prop("disabled", false);
        });
    };
});


burnForm.submit(function (e) {
    e.preventDefault();
    var amount = $('#burn-amount').val();
    if(!amount) alert('Amount can\'t be blank');
    else {
        burnFormInput.prop("disabled", true);
        burnStatusText.innerHTML = 'Please confirm transaction ...';

        var tokenContract = new web3.eth.Contract(abi, tokenAddress);
        tokenContract.methods.burn(amount).send({
            from: address
        }, function (error, transactionHash) {
            if (error) {
                console.error(error);
                burnFormInput.prop("disabled", false);
                return;
            }
            burnStatusText.innerHTML = getTransactionHashText(transactionHash);
        }).on('confirmation', function () {
            return;
        }).then(function (data) {
            burnFormInput.prop("disabled", false);
            burnStatusText.innerHTML = 'Burn successfully!';
        }).catch(function (error) {
            console.error(error);
            burnFormInput.prop("disabled", false);
        });;
    };
});