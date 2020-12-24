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
    await wallet.createTransfer(100, accounts[4], {from: accounts[0]});
    const transfers = await wallet.getTransfers();
    assert(transfers.length === 1);
    assert(transfers[0].id === '0');
    assert(transfers[0].amount === '100');
    assert(transfers[0].to === accounts[4]);
    assert(transfers[0].approvals === '0');
    assert(transfers[0].sent === false);
    // Numbers that are fields of structs are not wrapped in BN.js objects
    // They are strings instead
  });

  it.only('Should NOT create transfer if sender is not approved', async () => {
    try {
      await wallet.createTransfer(100, accounts[4], {from: accounts[4]});
    } catch (e) {
      // two objects that are caught
      console.log(e.message)
      console.log(e.reason)
      assert(e.message.includes('Only approver allowed.'));
      return;
    }
    return(false);
  });
});
