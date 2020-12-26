const Wallet = artifacts.require('Wallet');

module.exports = async function (deployer, _network, accounts) {
  const approvers = [accounts[0], accounts[1], accounts[2]];
  await deployer.deploy(Wallet, approvers, 2);
  // Make a pointer to our deployed smart contract.
  const wallet = await Wallet.deployed();
  // Send ether to smart contract using web3.js library
  await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: 10000});
};
