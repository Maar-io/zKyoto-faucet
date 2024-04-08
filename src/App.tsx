import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import { RPC, CONTRACT_ADDRESS, CONTRACT_ABI } from './const';
import logo from "./logo.svg";

declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {
  const [availableDrips, setAvailableDrips] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [next, setNext] = useState<string>("0");

  let signer: any = null;
  let provider: any = null;

  // Create a contract instance
  // const provider = new ethers.JsonRpcProvider(RPC);
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
  } else {
    alert('Please install MetaMask!');
  }
  const contractAddress = CONTRACT_ADDRESS;
  const contractABI = CONTRACT_ABI;
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  useEffect(() => {
    const fetchData = async () => {
      const data = await contract.availableDrips();
      setAvailableDrips(data.toString());
    };

    fetchData();
  }, [availableDrips]);

  const getRemainingTime = () => {
    const date = new Date(Number(next) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleInputChange = (event: { target: { value: any; }; }) => {
    const value = event.target.value;
    const isValid = /^0x[a-fA-F0-9]{40}$/.test(value);
  
    if (isValid || value === '') {
      setAddress(value);
      if (value !== '') {
        const fetchData = async () => {
          const data = await contract.nextDrip(value);
          console.log("nextDrip", data.toString());
  
          setNext(data.toString());
        };
        fetchData();
      }
      else {
        setNext("0");
      }
    }
    else {
      console.log("Invalid address");
      setAddress("");
      setNext("0");
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
  };
  return (
    <div className="App">
      <header className="App-header">
      <img src="/zKyoto-faucet/Astar_zkEVM_network_icon.png" alt="Logo" style={{ position: 'absolute', top: 0, left: 0, width: '100px', height: '100px', padding: '10px' }} />        <h1>
          zKyoto ETH Faucet
        </h1>
      </header>
      <img src="/zKyoto-faucet/faucet.png" alt="Faucet image" style={{ display: 'block', marginLeft: '0', marginRight: 'auto', width: '50%' }} />      <p>available drips: {availableDrips}</p>
      <input
        type="text"
        value={address}
        onChange={handleInputChange}
        placeholder="Enter ETH address"
        style={{ width: '350px' }}
      />
      <button onClick={handleButtonClick} disabled={address === '' || next!=="0" }>Drip</button>
      {address && next !== "0" && (
        <p>
          next available drip in: {getRemainingTime()}
        </p>
      )}    
      </div>
  );
}

export default App;