const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    
    const args = []
    const OuraLens = await deploy("OuraLens", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.POLYGONSCAN_API_KEY) {
        console.log("verifying...")
        await verify(OuraLens.address, args)
    }

    log("_____________________________________________________________")
}

module.exports.tags = ["all", "ouralens", "main"]
