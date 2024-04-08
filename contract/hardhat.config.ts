import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-ignition"
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/.env" });
const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY || "";
console.log("PrivateKey set:", !!ACCOUNT_PRIVATE_KEY)

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    artifacts: "./artifacts",
  },
  networks: {
    zKatana: {
      url: `https://rpc.zkatana.gelato.digital`,
      accounts: [ACCOUNT_PRIVATE_KEY]
    },
    zKatana2: {
      url: `https://rpc.startale.com/zkatana`,
      accounts: [ACCOUNT_PRIVATE_KEY]
    },
    zkyotoGelato: {
      url: `https://rpc.zkyoto.gelato.digital`,
      accounts: [ACCOUNT_PRIVATE_KEY]
    },
    zKyoto: {
      url: `https://rpc.startale.com/zkyoto`,
      accounts: [ACCOUNT_PRIVATE_KEY]
    },
    mumbai: {
      url: `https://polygon-testnet.public.blastapi.io`,
      accounts: [ACCOUNT_PRIVATE_KEY]
    },
    shibuya: {
      url: `https://evm.shibuya.astar.network`,
      accounts: [ACCOUNT_PRIVATE_KEY]
    },
    astarZkEvm: {
      url: `https://rpc.startale.com/astar-zkevm`,
      accounts: [ACCOUNT_PRIVATE_KEY]
    },
  },
  etherscan: {
    apiKey: {
      zKyoto: " ",
      astarZkEvm: " "
    },
    customChains: [
      {
        network: "zKyoto",
        chainId: 6038361,
        urls: {
          apiURL: "https://astar-zkyoto.blockscout.com/api",
          browserURL: "https://astar-zkyoto.blockscout.com/",
        },
      },
      {
        network: "astarZkEvm",
        chainId: 3776,
        urls: {
          apiURL: "https://astar-zkevm.explorer.startale.com/api",
          browserURL: "https://astar-zkevm.explorer.startale.com/",
        },
      }
    ],
  },
};

export default config;