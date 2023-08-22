const IpfsClient = require('ipfs-http-client');

async function createIPFSClient() {
    const auth = 'Basic ' + Buffer.from(process.env.IPFS_PROJECT_ID + ':' + process.env.IPFS_PROJECT_SECRET).toString('base64');
    console.log(auth)

const Client = IpfsClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
  })
    return Client
}

module.exports = { createIPFSClient }