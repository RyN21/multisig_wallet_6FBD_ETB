import React from 'react';

function TransferList({transfers}) {
  return (
    <div>
    <h2>Transfers</h2>
      <table>

        <thead>
          <tr>
            <th>Id</th>
            <th>Amount</th>
            <th>To</th>
            <th>approvers</th>
            <th>sent</th>
          </tr>
        </thead>

        <tbody>
          (trasnfers.map(transfer => (
            <tr key={transfer.id}>
              <td>{transfer.id}</td>
              <td>{transfer.amount}</td>
              <td>{transfer.to}</td>
              <td>{transfer.approvers}</td>
              <td>{transfer.sent ? 'yes' : 'no'}</td>
          )))
        </tbody>
      </table>
    </div>
  );
}

export default TransferList;
