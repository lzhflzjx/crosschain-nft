const { getNamedAccounts } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts()
    const { deploy, log } = deployments

    log("NFTPoolLockAndRelease Depolying")

    // address _router,address _link,address nftAddr
    let sourceChainRouter
    let linkToken
    let nftAddr

    const ccipSimulatorTx = await deployments.get("CCIPLocalSimulator")
    const ccipSimulator = await ethers.getContractAt("CCIPLocalSimulator", ccipSimulatorTx.address)
    const ccipSimulatorConfig = await ccipSimulator.configuration()
    sourceChainRouter = ccipSimulatorConfig.sourceRouter_
    linkToken = ccipSimulatorConfig.linkToken_
    const nftTx = await deployments.get("MyToken")
    nftAddr = nftTx.address


    // deploy(合约地址，部署参数)
    await deploy("NFTPoolLockAndRelease", {
        contract: "NFTPoolLockAndRelease",
        from: firstAccount,
        log: true,
        args: [sourceChainRouter, linkToken, nftAddr]
    })
    log("NFTPoolLockAndRelease deployed!")
}

module.exports.tags = ["sourcechain", "all"]