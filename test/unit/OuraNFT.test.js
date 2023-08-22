const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
const { assert } = require("chai")
const { createIPFSClient } = require("../../utils/IPFSClient")

const uri = {
        "name": "test",
        "description": "test",
        "token_ID": 1,
        "sleep": "9.2",
        "Reading_date": "5/31/2023",
    }


// See how to run these tests on mumbai testnet, grab the already deployed contracts and use them here
//Only runs locally
!developmentChains.includes(network.name) ? describe.skip : 
describe("OuraNFT Unit Tests", () => {
    let OuraNFT, deployer

    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        OuraNFT = await ethers.getContract("OuraNFT", deployer)
    })

    describe("constructor", () => {
        it("initializes the contract correctly", async () => {   
            const name = await OuraNFT.name()
            const symbol = await OuraNFT.symbol()
            assert.equal(name, "OuraData")
            assert.equal(symbol, "OUR")
        })
    })

    describe("Mint nft", () => {
        beforeEach(async () => {
            const ipfsClient = await createIPFSClient()
                   
            const metaDataResponse = await ipfsClient.add(JSON.stringify(uri)) 
            console.log(metaDataResponse)  
            const responseURI = "https://gumwall.infura-ipfs.io/ipfs/" + metaDataResponse.path
            const txResponse = await OuraNFT.safeMint(deployer, responseURI)
            await txResponse.wait(1)
        })

        it("Check NFT uri", async () => {
            const getUri = await OuraNFT.tokenURI(0)
            console.log(getUri)

            const response = await fetch(getUri);
            const responseJSON = await response.json();

            assert.equal(uri.name, responseJSON.name)
        })

        // it("Allows uer to mint nft", async () => {             
            
        //     const tokenURI = await BasicNFT.tokenURI(0)
        //     const mintCounter = await BasicNFT.getTokenCounter()

        //     assert.equal(tokenURI, await BasicNFT.TOKEN_URI())
        //     assert.equal(mintCounter.toString(), "1")
        // })

        // it("Shows the correct balancer and owner of NFT", async () => {                        
        //     const deployerAddress = deployer;
        //     const owner = await BasicNFT.ownerOf(0)

        //     const deployerBalance = await BasicNFT.balanceOf(deployerAddress)

        //     assert.equal(deployerBalance.toString(), "1")
        //     assert.equal(owner, deployerAddress)
        // })
    })
})