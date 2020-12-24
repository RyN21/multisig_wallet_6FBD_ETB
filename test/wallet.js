const { expectRevert } = require('@openzeppelin/test-helpers');
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

  it('Should NOT create transfer if sender is not approved', async () => {
    // Using openzeppelin/test-helper instead of try catch block
    await expectRevert(
      wallet.createTransfer(100, accounts[4], {from: accounts[4]}),
      'Only approver allowed.'
    );
    // try {
    //   await wallet.createTransfer(100, accounts[4], {from: accounts[4]});
    // } catch (e) {
    //   // two objects that are caught
    //   console.log(e.message)
    //   console.log(e.reason)
    //   assert(e.message.includes('Only approver allowed.'));
    //   return;
    // }
    // return(false);
  });

  it('Should increment approval', async () => {
    await wallet.createTransfer(100, accounts[4], {from: accounts[0]});
    await wallet.approveTransfer(0, {from: accounts[0]});
    const transfers = await wallet.getTransfers();
    const balance = await web3.eth.getBalance(wallet.address);
    assert(transfers[0].approvals === '1');
    assert(transfers[0].sent === false);
    assert(balance === '1000');
  });

  it('Should send transfer if quorum reached', async () => {
    const initialBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
    await wallet.createTransfer(100, accounts[6], {from: accounts[0]});
    await wallet.approveTransfer(0, {from: accounts[0]});
    await wallet.approveTransfer(0, {from: accounts[1]});
    const finalBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
    assert(finalBalance.sub(initialBalance).toNumber() === 100);
    const transfers = await wallet.getTransfers();
    assert(transfers[0].approvals === '2');
  });

  it('Should NOT approve transfer is sender is not approved', async () => {
    await wallet.createTransfer(100, accounts[5], {from: accounts[0]});
    await expectRevert(
      wallet.approveTransfer(0, {from: accounts[7]}),
      'Only approver allowed.'
    );
  });
});
