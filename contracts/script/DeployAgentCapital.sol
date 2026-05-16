// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "../lib/forge-std/src/Script.sol";
import "../lib/forge-std/src/console.sol";
import "../src/AgentCapital.sol";

/**
 * @title DeployAgentCapital
 * @notice Deploys only the AgentCapital contract to 0G Galileo testnet
 *
 * Run with:
 *   forge script script/DeployAgentCapital.sol \
 *     --rpc-url https://evmrpc-testnet.0g.ai \
 *     --broadcast \
 *     --private-key $PRIVATE_KEY \
 *     --legacy
 */
contract DeployAgentCapital is Script {
    function run() external {
        vm.startBroadcast();

        AgentCapital agentCapital = new AgentCapital();
        console.log("AgentCapital deployed at:", address(agentCapital));
        console.log("Network:  0G Galileo Testnet (Chain ID: 16602)");
        console.log("Deployer:", msg.sender);
        console.log("");
        console.log("Update VITE_AGENT_CAPITAL_CONTRACT in frontend/.env:");
        console.log(address(agentCapital));

        vm.stopBroadcast();
    }
}
