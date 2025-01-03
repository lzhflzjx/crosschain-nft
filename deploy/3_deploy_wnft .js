const { getNamedAccounts } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts()
    const { deploy, log } = deployments

    log("Deploying the wnft contract")
    // deploy(合约地址，部署参数)
    await deploy("WrappedMyToken", {
        contract: "WrappedMyToken",
        from: firstAccount,
        log: true,
        args: ["WrappedMyToken", "MNT"]
    })
    log("wnft is deployed!")
}

module.exports.tags = ["destchain", "all"]