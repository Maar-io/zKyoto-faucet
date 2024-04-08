// npx hardhat ignition deploy ignition/modules/Faucet.ts --network zKyoto --verify


import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ZKyotoFaucetModule = buildModule("ZKyotoFaucet", (m) => {
  const artifact = m.contract("ZKyotoFaucet", []);
  return { artifact };
});

export default ZKyotoFaucetModule;
