import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import { RPC, CONTRACT_ADDRESS, CONTRACT_ABI } from './const';
import logo from './logo.svg';

declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {
  const [availableDrips, setAvailableDrips] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [next, setNext] = useState<string>("");

  // Create a contract instance
  // const provider = new ethers.JsonRpcProvider(RPC);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractAddress = CONTRACT_ADDRESS;
  const contractABI = CONTRACT_ABI;
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  useEffect(() => {
    const fetchData = async () => {
      const data = await contract.availableDrips();
      console.log("availableDrips", data);
      setAvailableDrips(data.toString());
    };

    fetchData();
  }, []);

  const handleInputChange = (event: { target: { value: any; }; }) => {
    const value = event.target.value;
    const isValid = /^0x[a-fA-F0-9]{40}$/.test(value);

    if (isValid || value === '') {
      setAddress(value);
      const fetchData = async () => {
        const data = await contract.nextDrip(value);
        console.log("nextDrip", data.toString());

        setNext(data.toString());
      };
      fetchData();
    }
  };

  const handleButtonClick = async () => {
    // Call the drip function
    if (!address || signer === null) {
      return;
    }
    const contractWithSigner = contract.connect(signer);

    const tx = await contractWithSigner.drip(address);
    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    console.log('Transaction mined:', receipt);
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="Logo" style={{ position: 'absolute', top: 0, left: 0, width: '100px', height: '100px' }} />          <p>
          Yoki Origins NFT dashboard
        </p>
      </header>
      <p>available drips: {availableDrips}</p>
      <input
        type="text"
        value={address}
        onChange={handleInputChange}
        placeholder="Enter ETH address"
        style={{ width: '350px' }}
      />      
      <button onClick={handleButtonClick} disabled={address === ''}>Drip</button>
      {address && next!=="" && <p>next available drip: {new Date(Number(next) * 1000).toLocaleString()}</p>}
    </div>
  );
}

export default App;