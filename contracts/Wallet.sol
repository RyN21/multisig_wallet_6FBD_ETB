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

  function createTransfer(uint amount, address payable to) external {
    transfers.push(Transfer(
      transfers.lenght,
      amount,
      to,
      0,
      false
    ));
  }

}
