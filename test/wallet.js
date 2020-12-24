const Wallet = artifacts.require('Wallet');

contract('Wallet', (accounts) => {
  let wallet;
  beforeEach(async () => {
    wallet = await Wallet.new([accounts[0], accounts[1], accounts[2]], 2);
    await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: 1000});
  });

  it('Should have correct approvers and quorum', async () => {
    const approvers = await wallet.getApprovers();
    const quorum = await wallet.quorum();
    assert(approvers.length === 3);
    assert(approvers[0] === accounts[0]);
    assert(approvers[1] === accounts[1]);
    assert(approvers[2] === accounts[2]);
    assert(quorum.toNumber() === 2);
    // A method of BN is '.toNumber'
    // quurom.toNumber convers solidity BN into javascript number
    // Solidity numbers are wrapped in BN.js
    // BN.js library that deals will large numbers

    // If BN is too large to convert to a javascript number
    // then use method '.toString' to assert to a string of the large number
  });

  it('Should create a transfer', async () => {
    await wallet.createTransfer(100, accounts[4], {from: account[0]});
    const transfers = await wallet.getTransfers();
    assert(transfers.length == 1);
    assert(transfers[0] == newTransfer);
    assert(newTransfer.id == 1);
    assert(newTransfer.amount == 100);
    assert(newTransfer.to == account[4]);
    assert(newTransfer.approvals == 0);
    assert(newTransfer.sent == false);
  });
});
