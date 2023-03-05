// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";
import "hardhat/console.sol";

error OuraLens__UpkeepNotNeeded();

// *** It looks like to fetch external API data I will need to use the ChainlinkClient: https://docs.chain.link/any-api/api-reference/

contract OuraLens is AutomationCompatibleInterface {

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