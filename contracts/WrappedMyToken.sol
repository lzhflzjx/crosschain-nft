// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {MyToken} from "./wrappedMyToken.sol";

contract WrappedMyToken is MyToken {
    constructor(
        string memory tokenName,
        string memory tokenSymbol
    ) MyToken(tokenName, tokenSymbol) {}

    // 铸造生成唯一Id的函数
    function mintTokenWithSpecficTokenId(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
    }
}
