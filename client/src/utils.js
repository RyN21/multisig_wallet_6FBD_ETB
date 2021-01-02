import Web3 from 'web3';
import Wallet from './contracts/Wallet.json';

const getWeb3 = () => {
  return new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      // If metamask is injected in our javascript code
      if(window.ethereum) {
        const web3 = new Web3(window.ethereum); // window.ethereum is a provider object
        try {
          // 'enable' asks user if you want to grant access to dapp. Privacy reasons
          await window.ethereum.enable();
          resolve(web3);
        } catch(error) {
          reject(error);
        }
      // If user is using an old metamask Wallet
      } else if (window.web3) {
        resolve(window.web3);
      // If metamask is not installed
      } else {
        reject('Must install Metamask');
      }
    });
  });
};

const getWallet = async web3 => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = Wallet.networks[networkId];
  return new web3.eth.Contract(
    Wallet.abi,
    deployedNetwork && deployedNetwork.address
  );
};

export { getWeb3, getWallet };
