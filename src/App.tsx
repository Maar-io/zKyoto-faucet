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
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  let provider: any = null;

  // Create a contract instance
  // const provider = new ethers.JsonRpcProvider(RPC);

  useEffect(() => {
    const connectMetaMask = async () => {  
      if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []); // <- this prompts user to connect MetaMask
        const s = provider.getSigner();
        setSigner(s);


        // Create the contract instance after the provider is set
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        setContract(contract);
      } else {
        alert('Please install MetaMask!');
      }

    };
  
    connectMetaMask();
  }, []); 


  useEffect(() => {
    const fetchData = async () => {
      if (contract) {
        const data = await contract.availableDrips();
        setAvailableDrips(data.toString());
      }
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
          if (contract) {
            const data = await contract.nextDrip(value);
            console.log("nextDrip", data.toString());
            setNext(data.toString());
          }
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
    console.log("click drip: ", address, !!signer, contract);
    if (!address || signer === null || contract === null) {
      return;
    }
    const contractWithSigner = contract.connect(signer);

    try {
      const tx = await contractWithSigner.drip(address);
    } catch (error) {
      console.error("Error executing drip: ", error);
    }
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