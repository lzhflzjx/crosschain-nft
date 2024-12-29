const { getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    if (developmentChains.includes(network.name)) {
        const { firstAccount } = await getNamedAccounts()
        const { deploy, log } = deployments

        log("Deploying CCIP Simulator contract")
        // deploy(合约地址，部署参数)
        await deploy("CCIPLocalSimulator", {
            contract: "CCIPLocalSimulator",
            from: firstAccount,
            log: true,
            args: []
        })
        log("CCIP Simulator deployed!")
    } else {
        log("not in local, skip CCIP local")
    }
}

module.exports.tags = ["test", "all"]