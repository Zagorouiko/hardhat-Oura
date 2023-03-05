const pinataSDK = require("@pinata/sdk")
require("dotenv").config()

const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET)

async function storeTokenUriMetadata(metadata) {
    try {
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    } catch (err) {
        console.log(err)
    }
    return null
}

module.exports = { storeTokenUriMetadata }