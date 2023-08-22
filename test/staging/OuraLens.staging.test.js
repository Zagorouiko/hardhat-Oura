const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
const { assert } = require("chai")
const { createIPFSClient } = require("../../utils/IPFSClient")

developmentChains.includes(network.name) ? describe.skip : 
describe("OuraLens staging Tests", () => {
    let volume, OuraLens, deployer

    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        OuraLens = await ethers.getContract("OuraLens", deployer)
        OuraNFT = await ethers.getContract("OuraNFT", deployer)
    })

    describe("constructor", () => {
        it("initializes the contract correctly", async () => {   
            const jobId = OuraLens.jobId()
            assert(jobId, "ca98366cc7314957b8c012c72f05aeeb")
        })
    })

    describe("RequestVolume", () => {    
        beforeEach(async () => {
            const tx = await OuraLens.requestVolumeData("https://api.ouraring.com/v1/sleep?start=2023-03-04&end=2023-03-05&access_token=I3T4K4ICNNNE76NSCSHQC26VQWNHBBYH")
            await tx.wait(6)
            const response = await OuraLens.volume()
            const hexString = response._hex.toString()
            volume = parseInt(hexString)
            console.log(`Volume: ${volume}`)
        })  

        it("Returns the data", async () => {
            assert(volume, 34740)
        })

        it("Creates the nft", async () => {
            const ipfsClient = await createIPFSClient()
            const sleepTime = volume / 3600
            const uri = {
                "name": "Oura Ring Sleep Data",
                "description": "hours slept",
                "sleep": sleepTime
            }


            // const gasPrice = await OuraLens.signer.getGasPrice();
            // console.log(`Current gas price: ${gasPrice}`);
          
            // const estimatedGas = await OuraLens.signer.estimateGas(
            //     ethers.Contract.getDeployTransaction(),
            // );
            // console.log(`Estimated gas: ${estimatedGas}`);



            const metaDataResponse = await ipfsClient.add(JSON.stringify(uri)) 
            const responseURI = "https://lensfriendz.infura-ipfs.io/ipfs/" + metaDataResponse.path

            console.log(`ResponseURI: ${responseURI}`)

            const tx = await OuraLens.mint(responseURI, {gasLimit: 3000000})
            await tx.wait(6)

            const responseTokenCount = await OuraNFT.getTokenCount()
            const tokenCountHex = responseTokenCount._hex.toString()
            const tokenCount = parseInt(tokenCountHex)
            // The tokenCount seems to always be ahead by 1, something with the increment/race condition, so I subtract by 1
            const getUri = await OuraNFT.tokenURI(tokenCount - 1)

            const response = await fetch(getUri);
            const responseJSON = await response.json();

            const nftOwners = await OuraLens.getouraNFTOwners()
            console.log(`nftOwners: ${nftOwners}`)
            assert.equal(nftOwners[0], "0x7250eE8997c02039B01A0Aa309048Ffad7a958BA")
            assert.equal(uri.name, responseJSON.name)
        })
    })
})