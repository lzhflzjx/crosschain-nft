const {getNamedAccounts, network} = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts()
    const { deploy, log } = deployments

    log("NFTPoolBurnAndMint Depolying")

    // address _router,address _link,address wnftAddr
    let destChainRouter
    let linkToken
    let wnftAddr

    if (developmentChains.includes(network.name)) {
        const ccipSimulatorTx = await deployments.get("CCIPLocalSimulator")
        const ccipSimulator = await ethers.getContractAt("CCIPLocalSimulator", ccipSimulatorTx.address)
        const ccipSimulatorConfig = await ccipSimulator.configuration()
        destChainRouter = ccipSimulatorConfig.destinationRouter_
        linkToken = ccipSimulatorConfig.linkToken_
    } else {
        router = networkConfig[network.config.chainId].router
        linkTokenAddr = networkConfig[network.config.chainId].linkToken
    }

    const wnftTx = await deployments.get("WrappedMyToken")
    wnftAddr = wnftTx.address
    console.log('wnftAddr', wnftAddr)


    // deploy(合约地址，部署参数)
    await deploy("NFTPoolBurnAndMint", {
        contract: "NFTPoolBurnAndMint",
        from: firstAccount,
        log: true,
        args: [destChainRouter, linkToken, wnftAddr]
    })
    log("NFTPoolBurnAndMint deployed!")
}

module.exports.tags = ["destchain", "all"]