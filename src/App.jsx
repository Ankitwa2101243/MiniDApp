import { useEffect, useState } from 'react';
import './App.css';
import Abi from './Abi.json';
import Web3 from 'web3';
import toast,{Toaster} from 'react-hot-toast';

function App() {
  const [contract, setContract] = useState('');
  const [token, SetToken] = useState('');
  const [connectedAccount, setConntedAccount] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = window.ethereum;
        const web3 = new Web3(provider);
        const contractAddress = '0x963cB67734473008B9Fcec9197503c5EBB895303';
        const contractInstance = new web3.eth.Contract(Abi, contractAddress);
  
        // Request account access if needed
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
        if (accounts.length === 0) {
          toast.error("No account found");
          return;
        }
  
        setConntedAccount(accounts[0]);
        setContract(contractInstance);
        toast.success("Wallet connected successfully");
      } catch (error) {
        toast.error("Failed to connect wallet");
        console.error("Error connecting to wallet:", error);
      }
    } else {
      toast.error("Metamask is not installed");
      console.log('Metamask is not installed');
    }
  }
  

  const transferToken = async () => {
    if (!to || !amount) {
      toast.error("Please enter a valid address and amount");
      return;
    }
    try {
      // Convert the amount to Wei
      const weiAmount = Web3.utils.toWei(amount, 'ether');
      await contract.methods.transfer(to, weiAmount).send({ from: connectedAccount });
      toast.success("Token transferred");
      setTo('');
      setAmount('');
    } catch (error) {
      toast.error("Token transfer failed");
      console.error("Error transferring token:", error);
    }
  }

  useEffect(() => {
    const tokenSymbol = async () => {
      const token = await contract.methods.symbol().call();
      SetToken(token);
    }
    contract && tokenSymbol();
  }, [contract]);

  return (
    <>
      <Toaster position="bottom-right" />
      <h1>TOKEN NAME : {token}</h1>
      <br />
      <h2>Connected Account : {connectedAccount}</h2>
      
      
      {!connectedAccount && (
        <button onClick={connectWallet}>
          Connect Wallet
        </button>
      )}

      <div>
        <input
          type='text'
          placeholder='Recipient Address'
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      <div>
        <input 
          type="number" 
          placeholder="Amount" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)} 
        />
      </div>

      <button onClick={transferToken}>
        Transfer Token
      </button>
      
    </>
  );
}

export default App;