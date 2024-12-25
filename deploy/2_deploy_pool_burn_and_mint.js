const { getNamedAccounts } = require("hardhat");

module.exports = async({getNamedAccounts, deployments}) => {
    const {firstAccount} = await getNamedAccounts()
    const {deploy, log} = deployments
    
    log("NFTPoolLockAndRelease deploying...")
    // deploy(合约地址，部署参数)
    await deploy("MyToken", {
        contract: "MyToken",
        from: firstAccount,
        log: true,
        args: ["MyNFT", "MNT"]
    })
    log("MyToken is deployed!")
}

module.exports.tags = ["all", "sourcechain"]