// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "hardhat/console.sol";

error OuraLens__UpkeepNotNeeded();

// *** It looks like to fetch external API data I will need to use the ChainlinkClient: https://docs.chain.link/any-api/api-reference/

    uint256 public enforcementActions;
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

contract OuraLens is AutomationCompatibleInterface, ChainlinkClient {

    constructor() public {
        setPublicChainlinkToken();
        oracle = 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e; //grab these from chainlink this is based on response type - number will be different than string
        jobId = "29fa9aa13bf1468788b7cc4a500a45b8"; //grab these these from chainlink
        fee = 0.1 * 10 ** 18; // 0.1 LINK
    }

    function requestEnforcementData() public returns (bytes32 requestId) 
    {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
    
        request.add("get", "https://api.fda.gov/food/enforcement.json?search=report_date:[2015101+TO+20151231]&limit=1");
        request.add("path", "meta.results.total");
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    function fulfill(bytes32 _requestId, uint256 _enforcementActions) public recordChainlinkFulfillment(_requestId)
    {
        enforcementActions = _enforcementActions;
    }



    function checkUpkeep(bytes memory) public override returns (bool upkeepNeeded, bytes memory) {   
        // Essentially I always want this to run every x time intervals (say every 24 hours)
        // It will set upkeepNeeded to true only if the previous oura data nft fetched does not equal the current fetch
        // Will have to fetch both and compare so as to not duplicate nfts
        
        upkeepNeeded = true;
    }

    /**
     * @dev Once `checkUpkeep` is returning `true`, this function is called
     */
     // This function gets called off chain by the oracle nodes in a set time setup via cron
     // Once upkeepneeded is true and proceeds through the rest of the code here, a new nft will need to be created
     // 1. Set up Chainlink Keepers to ping this which will then create an OuraNFT and send it to my account every interval
     // 2. Figure out how to first fetch data via smart contract (is that possible?)

    function performUpkeep(bytes calldata) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        // require(upkeepNeeded, "Upkeep not needed");
        if (!upkeepNeeded) {
            revert OuraLens__UpkeepNotNeeded();
        }
    }
}