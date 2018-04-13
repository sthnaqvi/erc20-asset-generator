var web3 = window.web3 || {};


// abi of StandardToken.sol
var abi = [
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
var bytecode = '6060604052341561000f57600080fd5b6104008061001e6000396000f300606060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806318160ddd1461005c57806370a0823114610085578063a9059cbb146100d2575b600080fd5b341561006757600080fd5b61006f61012c565b6040518082815260200191505060405180910390f35b341561009057600080fd5b6100bc600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610136565b6040518082815260200191505060405180910390f35b34156100dd57600080fd5b610112600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190505061017e565b604051808215151515815260200191505060405180910390f35b6000600154905090565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141515156101bb57600080fd5b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054821115151561020857600080fd5b610259826000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461039d90919063ffffffff16565b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506102ec826000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546103b690919063ffffffff16565b6000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905092915050565b60008282111515156103ab57fe5b818303905092915050565b60008082840190508381101515156103ca57fe5b80915050929150505600a165627a7a723058207413e596d11de0a04fd9605b721b6a3ed9d2ef8f78dfbd43d27e2d37fa8bf3820029';

// will be the address and instance of a deployed erc20 smart-contract
var contractAddress;

var isMainNetwork, isRopsten, isRinkeby;

var provider;

var noMetamask = $('#no-metamask');
var accountAddress = $('#current-address');
var currentNetwork = $('#current-network');
var metamaskLocked = $('#metamask-locked');
var metamaskUnlocked = $('#metamask-unlocked');


var assetFormInput = $('#asset-form :input');

//hide all change able elements
noMetamask.hide();
accountAddress.hide();
currentNetwork.hide();
metamaskLocked.hide();
metamaskUnlocked.hide();

function web3Exists() {
    return Object.keys(web3).length > 0;
}

if (!web3Exists()) {
    noMetamask.show();
    //disable all form input fields
    assetFormInput.prop("disabled", true);
    console.log("web3 not exits");
} else console.log("web3Exists");

if (web3Exists())
    provider = web3.currentProvider;

function sendSync(params) {
    var defer = $.Deferred();
    if (web3Exists())
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
    return sendSync({method: 'net_version', params: []})
        .then(function (result) {
            return result['result'];
        })
        .fail(function (err) {
            return err
        })
}

function getAccount() {
    return sendSync({method: 'eth_accounts', params: []})
        .then(function (result) {
            return result['result'];
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
                assetFormInput.prop("disabled", false);
                accountAddress.html('<strong>Your Current Address: ' + account[0] + ' </strong>').show();
            }
        })
        .fail(function (err) {
            if (err.message !== "Metamask Locked")
                console.log(err)
        });
}, 1000);

function deploy() {
    var name = $('#name').val();
    var symbol = $('#symbol').val();
    var decimals = $('#decimals').val();
    var totalSupply = $('#total-supply').val();


    if (name === '') {
        alert('name can\'t be blank')
    } else if (symbol === '') {
        alert('symbol can\'t be blank')
    } else if (decimals === '') {
        alert('decimals can\'t be blank')
    } else if (totalSupply === '') {
        alert('totalSupply can\'t be blank')
    } else {
        //disable all form input fields
        assetFormInput.prop("disabled", true);
        statusText.innerHTML = 'Waiting for contract to be deployed...'

        var contract = web3.eth.contract(abi);

        var deployedContract = contract.new(totalSupply, name, decimals, symbol, {
            from: web3.eth.accounts[0],
            data: bytecode
        }, function (error, result) {
            if (!error) {
                if (!deployedContract.address) {
                    console.log(result);
                    if (isMainNetwork) {
                        statusText.innerHTML = 'Contract deployment in progress - please be patient. If nothing happens for a while check if there\'s any errors in the console (hit F12). Transaction hash: <a href="https://etherscan.io/tx/' + result.transactionHash + '" target="_blank">' + result.transactionHash + '</a>'
                    } else if (isRopsten) {
                        statusText.innerHTML = 'Contract deployment in progress - please be patient. If nothing happens for a while check if there\'s any errors in the console (hit F12). Transaction hash: <a href="https://ropsten.etherscan.io/tx/' + result.transactionHash + '" target="_blank">' + result.transactionHash + '</a>'
                    } else if (isRinkeby) {
                        statusText.innerHTML = 'Contract deployment in progress - please be patient. If nothing happens for a while check if there\'s any errors in the console (hit F12). Transaction hash: <a href="https://rinkeby.etherscan.io/tx/' + result.transactionHash + '" target="_blank">' + result.transactionHash + '</a>'
                    } else
                        statusText.innerHTML = 'Contract deployment in progress - please be patient. If nothing happens for a while check if there\'s any errors in the console (hit F12). Transaction hash: ' + result.transactionHash

                } else {
                    statusText.innerHTML = 'Contract deployed at address <b>' + deployedContract.address + '</b> - keep a record of this.'
                }
            } else {
                console.error(error)
            }
        })
    }
}