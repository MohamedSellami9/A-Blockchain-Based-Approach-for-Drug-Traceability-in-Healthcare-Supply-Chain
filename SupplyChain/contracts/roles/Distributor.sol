// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Roles.sol";

contract Distributor{

    using Roles for Roles.Role;
    Roles.Role private distributors;
    constructor () {
        addDistributor(msg.sender);
    }
    modifier onlyDistributor() {
    require(isDistributor(msg.sender), "This account has no a Distributor Role");
    _;
  }
    function addDistributor(address account) internal {
        distributors.add(account);
       
    }

    function removeDistributor(address account) internal {
        distributors.remove(account);
    }

    function isDistributor(address account) public view returns (bool) {
        return distributors.has(account);
    }
}