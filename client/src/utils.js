import Web3 from 'web3';
import Wallet from './contracts/Wallet.sol';

const getWeb3 = () => {
  return new Web3('http://localhost:9545');
};
