const { getNamedAccounts, deployments, ethers } = require("hardhat")
const { expect } = require("chai")//断言库

let firstAccount
let nft
let wnft
let poolLnU
let poolMnB
let chainSelector

before(async function () {
    firstAccount = (await getNamedAccounts()).firstAccount
    await deployments.fixture(["all"])//这个操作会将所有合约部署完成
    nft = await ethers.getContract("MyToken", firstAccount)
    wnft = await ethers.getContract("WrappedMyToken", firstAccount)
    poolLnU = await ethers.getContract("NFTPoolLockAndRelease", firstAccount)
    poolMnB = await ethers.getContract("NFTPoolBurnAndMint", firstAccount)

    // chainSelector(destChainSelector)：这是一个数值，通常用于标识目标区块链网络。
    // 在跨链通信的上下文中，不同的区块链网络可能会被分配一个唯一的标识符或选择器。
    // 这个选择器帮助合约识别消息应该被发送到哪个特定的区块链网络。
    ccipLocalSimulator = await ethers.getContract("CCIPLocalSimulator", firstAccount)
    chainSelector = (await ccipLocalSimulator.configuration()).chainSelector_
})

describe("source chain => dest chain tests",
    async function () {
        it("test if user can mint a nft from nft contract successfuly",
            async function () {
                // get nft
                await nft.safeMint(firstAccount)
                // check the owner
                const ownerOfNft = await nft.ownerOf(0)
                expect(ownerOfNft).to.equal(firstAccount)
            })
        it('test if user can lock the nft in the pool and send ccip message on source chain',
            async function () {
                // lock and send with CCIP
                // approve：这是一个存在于ERC-721和ERC-1155等标准中的函数，它的作用是授权另一个地址
                await nft.approve(poolLnU.target, 0)
                // // requestLinkFromFaucet：用来从水龙头（faucet）请求资金。
                // // 在区块链测试和开发中，水龙头通常是一个用于分配测试网络的代币的智能合约或服务。
                await ccipLocalSimulator.requestLinkFromFaucet(poolLnU, ethers.parseEther("10"))
                await poolLnU.lockAndSendNFT(0, firstAccount, chainSelector, poolMnB.target)

                // check if owner of nft is pool's address
                const newOwner = await nft.ownerOf(0)
                console.log("test")
                expect(newOwner).to.equal(poolLnU.target)
            }
        )

        it("test if user can get a wrapped nft in dest chain",
            async function () {
                const owner = await wnft.ownerOf(0)
                expect(owner).to.equal(firstAccount)
            })
    })

describe("dest chain -> source chain",
    async function () {
        it('test if user can burn the wnft and send ccip message on dest chain',
            async function () {
                await wnft.approve(poolMnB.target, 0)
                await ccipLocalSimulator.requestLinkFromFaucet(poolMnB, ethers.parseEther("10"))
                // transfer the token
                await poolMnB.burnAndSendNFT(0, firstAccount, chainSelector, poolLnU.target)
                const wnftTotalSupply = await wnft.totalSupply()
                expect(wnftTotalSupply).to.equal(0)
            }
        )

        it("test if user have the nft unlocked on source chain",
            async function () {
                const owner = await nft.ownerOf(0)
                expect(owner).to.equal(firstAccount)
            })
    }
)

// source chain => dest chain tests
// test if user can mint a nft from nft contract successfuly
//test if user can lock the nft in the pool and send ccip message on source chain
// test if user can get a wrapped nft in dest chain
// dest chain -> source chain
// test if user can burn the wnft and send ccip message on dest chain
// test if user have the nft unlocked on source chain