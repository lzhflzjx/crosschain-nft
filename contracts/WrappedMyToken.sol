// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

import {MyToken} from "./MyToken.sol";

contract WrappedMyToken is MyToken {
    constructor(string memory tokenName, string memory tokenSymbol) 
    MyToken(tokenName, tokenSymbol) {}

    // 生成唯一id
    function mintWithSpecificTokenId(address to, uint256 _tokenId) public {
        _safeMint(to, _tokenId);
    }
}