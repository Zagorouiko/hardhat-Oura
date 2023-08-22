// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";
import "contracts/OuraNFT.sol";

// error OuraLens__UpkeepNotNeeded();

// *** It looks like to fetch external API data I will need to use the ChainlinkClient: https://docs.chain.link/any-api/api-reference/

//REMEMBER TO FUND THIS CONTRACT WITH LINK

contract OuraLens is ChainlinkClient, ConfirmedOwner {

    using Chainlink for Chainlink.Request;

    address public ouraNFTAddress = 0xEDAC0B97328983eAB2c05B765906fFA0D293f52E;
    uint256 public volume;
    bytes32 public jobId;
    uint256 private fee;

    // minter addresses
    address[] public ouraNFTOwners;

    mapping(address => bool) public ouraNFTOwnerExists;

    event RequestVolume(bytes32 indexed requestId, uint256 volume);

    //Mumbai testnet link token and testnet oracle contract addresses
    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        setChainlinkOracle(0x40193c8518BB267228Fc409a613bDbD8eC5a97b3);
        jobId = "ca98366cc7314957b8c012c72f05aeeb";
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
    }

    //  * Create a Chainlink request to retrieve API response, find the target
    function requestVolumeData(string memory endpoint) public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        // Set the URL to perform the GET request on
        // Will need to get access code each time from the front-end and pass it into here
        req.add(
            "get",
            endpoint
        );

        // Set the path to find the desired data in the API response, where the response format is:
        // {"RAW":
        //   {"ETH":
        //    {"USD":
        //     {
        //      "VOLUME24HOUR": xxx.xxx,
        //     }
        //    }
        //   }
        //  }
        // request.add("path", "RAW.ETH.USD.VOLUME24HOUR"); // Chainlink nodes prior to 1.0.0 support this format
        req.add("path", "sleep,0,duration"); // Chainlink nodes 1.0.0 and later support this format

        int256 timesAmount = 1;
        req.addInt("times", timesAmount);

        // Sends the request
        return sendChainlinkRequest(req, fee);
    }

    /**
     * Receive the response in the form of uint256
     */
    function fulfill(
        bytes32 _requestId,
        uint256 _volume
    ) public recordChainlinkFulfillment(_requestId) {
        emit RequestVolume(_requestId, _volume);
        volume = _volume;
    }

    //Need to read the volume on the front-end once the request comes back; Then create the IPFS uri with that volume value THEN run this function and pass the uri in
    function mint(string memory uri) public {  
        OuraNFT nft = OuraNFT(ouraNFTAddress);     
        nft.safeMint(msg.sender, uri);
        volume = 0;

        if (ouraNFTOwnerExists[msg.sender] == false) {
            ouraNFTOwners.push(msg.sender);
            ouraNFTOwnerExists[msg.sender] = true;
        }                    
    }

    function getouraNFTOwners() external view returns (address[] memory) {
        return ouraNFTOwners;
    }
}