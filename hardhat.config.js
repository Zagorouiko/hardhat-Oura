require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{version: "0.8.17"}, {version: "0.6.6"}, {version: "0.8.0"}, {version: "0.6.6"}, {version: "0.6.0"}]
  },
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 6,
      gas: 5000000,
      timeout: 60000
    },
    mumbai: {
      url: process.env.MUMBAI_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 80001,
      blockConfirmations: 6,
      gas: 3000000,
      timeout: 60000
    },
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
      gas: 5000000,
    },
    localhost: { 
      chainId: 31337, 
      blockConfirmations: 1,
      gas: 5000000, 
    },
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    token: "LINK"
  },
  etherscan: {
    apiKey: 
      process.env.POLYGONSCAN_API_KEY
    },
  namedAccounts: {
    deployer: {
      default: 0,
      5: 0
    },
    player: {
      default: 1
    },
  },
  mocha: {
    timeout: 500000
  }
};
