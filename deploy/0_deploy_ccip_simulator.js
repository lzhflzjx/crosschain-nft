const { getNamedAccounts } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
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
}

module.exports.tags = ["test", "all"]