pragma solidity ^0.6.0;
// ABIEncoderV2: in order to use the Transfer struct in the getTransfer function 'returns(Transfer[] memory)' we need this
// ability to return an array of struct
pragma experimental ABIEncoderV2;

contract Wallet {
  address[] public approvers;
  uint public quorum;
  struct Transfer {
    uint id;
    uint amount;
    address payable to;
    uint approvals;
    bool sent;
  }
  Transfer[] public transfers;
  mapping(address => mapping(uint => bool)) public approvals;

  constructor(address[] memory _approvers, uint _quorum) public {
    approvers = _approvers;
    quorum    = _quorum;
  }

  function getApprovers() external view returns(address[] memory) {
    return approvers;
  }

  function getTransfers() external view returns(Transfer[] memory) {
    return transfers;
  }

  function createTransfer(uint amount, address payable to) external onlyApprover() {
    transfers.push(Transfer(
      transfers.length,
      amount,
      to,
      0,
      false
    ));
  }

  function approveTransfer(uint id) external onlyApprover() {
    require(transfers[id].sent == false, 'Transfer has already been sent.');
    require(approvals[msg.sender][id] == false, 'Address already approved transfer.');

    approvals[msg.sender][id] = true;
    transfers[id].approvals++;

    if(transfers[id].approvals >= quorum) {
      transfers[id].sent = true;
      address payable to = transfers[id].to;
      uint amount = transfers[id].amount;
      to.transfer(amount);
    }
  }

  // Native way with Solidity that allows a contract to recieve Ether
  // Instead of creating a 'function recieveEther' function
  // To call this function just send ether to this smart contract's address
  receive() external payable {}

  modifier onlyApprover() {
    bool allowed = false;
    for(uint i = 0; i < approvers.length; i++) {
      if(approvers[i] == msg.sender) {
        allowed = true;
      }
    }
    require(allowed == true, 'Only approver allowed.');
    _;
  }
}
