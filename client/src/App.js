// import tools from react's api library called Hooks
import React, { useEffect, useState } from 'react';
import { getWeb3, getWallet } from './utils.js';
import Header from './Header.js';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);
  const [approvers, setApprovers] = useState([]);
  const [quorum, setQuorum] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const web3 = getWeb3();
      const accounts = await web3.eth.getAccounts();
      const wallets = await getWallet(web3);
      const approvers = wallet.methods.getApprovers().call();
      const quorum = await wallet.methods.quorum().call();
      setWeb3(web3);
      setAccounts(accounts);
      setWallet(wallet);
      setApprovers(approvers);
      setQuorum(quorum);
    };
    init();
  }, []);

  if(
    typeof web3 === 'undefined'
    || typeof accounts === 'undefined'
    || typeof wallet === 'undefined'
  ) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      Multisig Dapp
      <header approvers={approvers} quorum={quorum}/>
    </div>
  );
}

export default App;
