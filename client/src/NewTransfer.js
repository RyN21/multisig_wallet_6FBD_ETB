import React, { useState } from 'react';

function NewTransfer() {
  // define a state for the transfer object that we are going to create with a form
  const [transfer, setTransfer] = useState(undefined);

  // return HTML
  return (
    <div>
      <h2>Create Transfer</h2>
      <form>
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="text"
          onChange={e => updateTransfer(e, 'amount')}
        />

        <label htmlFor="to">Send to</label>
        <input
          id="to"
          type="text"
          onChange={e => updateTransfer(e, 'amount')}
        />
        <button>Submit</button>
      </form>
    </div>
  )
}

export default NewTransfer;
