const { ethers } = require("hardhat")
const fs = require("fs")

const frontEndContractsFile = "../Lenz/constants/networkMapping.json"
const frontEndAbiFile = "../Lenz/constants/"

module.exports = async function() {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end")
        await updateContractAddresses()
        await updateAbi()
    }
}

async function updateAbi() {
    const OuraLens = await ethers.getContract("OuraLens")
    fs.writeFileSync(`${frontEndAbiFile}OuraLensABI.json`, OuraLens.interface.format(ethers.utils.FormatTypes.json))

    const OuraNFT = await ethers.getContract("OuraNFT")
    fs.writeFileSync(`${frontEndAbiFile}OuraNFTABI.json`, OuraNFT.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses() {
    const OuraLens = await ethers.getContract("OuraLens")
    const chainId = network.config.chainId.toString()
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if (chainId in contractAddresses) {
        // JSON query tips: the brackets are JSON props, example here: 
        //       FILE          {"5": { "NftMarketplace" : [ "0x9fe2378dsfjkhsdfksa" ]}}
        if (!contractAddresses[chainId]["OuraLens"].includes(OuraLens.address)) {
            // contractAddresses[chainId]["OuraLens"][0].splice(0, 1)
            contractAddresses[chainId]["OuraLens"].push(OuraLens.address)
        }
    } else {
        contractAddresses[chainId] = { OuraLens: [OuraLens.address] }
    }

    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"]