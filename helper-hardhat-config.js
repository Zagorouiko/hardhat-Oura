const { ethers } = require("hardhat")

const networkConfig = {
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
    31337: {
        name: "hardhat",
    },
    80001: {
        name: "mumbai"
    }
}

const developmentChains = ["hardhat", "localhost"]

// Chainink nodes pay the gas fees to give randomness since they're the ones calling functions on the SC 
// So that's why we send the gas_price_link

module.exports = {
    networkConfig,
    developmentChains,
}