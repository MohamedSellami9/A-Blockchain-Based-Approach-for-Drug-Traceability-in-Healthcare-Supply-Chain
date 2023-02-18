// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Roles.sol";

contract Manufacturer {

    using Roles for Roles.Role;
    Roles.Role private manufacturers;
    constructor () {
        addManufacturer(msg.sender);
    }
    modifier onlyManufacturer() {
    require(isManufacturer(msg.sender), "This account has no a Manufacturer Role");
    _;
  }
    function addManufacturer(address account) internal {
        manufacturers.add(account);
       
    }

    function removeManufacturer(address account) internal {
        manufacturers.remove(account);
    }
    function isManufacturer(address account) public view returns (bool) {
        return manufacturers.has(account);
    }
}