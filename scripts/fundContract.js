const { ethers, network } = require("hardhat")
const LINK_ABI = require("../constants/LINK_ABI.json")

// run "npx hardhat run scripts/fundContract.js --network mumbai"
async function fundContract() {
    const OuraLens = await ethers.getContract("OuraLens")

    // ethers.getSigner returns a promise, while ethers.provider.getSigner don't. That is, you need to use await in the first case.
    // The Signer returned by ethers.getSigner is a wrapper created by the plugin that behaves pretty much exactly like the one returned by ethers.provider.getSigner, 
    // except that it has a .address property, so you don't need to call signer.getAddress(), which is an async function
    const wallet = await ethers.getSigner("0x7250eE8997c02039B01A0Aa309048Ffad7a958BA");

    const LINK_ADDRESS = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
    const LINKABI = require('../constants/LINK_ABI.json');

    // ethers.providers connects to whatever provider network you specify, example: --network mumbai
    const provider = ethers.provider;
    const LINK = new ethers.Contract(LINK_ADDRESS, LINKABI, provider);

    console.log(`Sending eth from ${wallet.address} to ${OuraLens.address}`)
    const connectedWallet = await LINK.connect(wallet)
    const transfer = await connectedWallet.transferAndCall(OuraLens.address, 1, {gasLimit: 3000000});
    const transactionReceipt = await transfer.wait(1)
    console.log(transactionReceipt)   
}

fundContract()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })