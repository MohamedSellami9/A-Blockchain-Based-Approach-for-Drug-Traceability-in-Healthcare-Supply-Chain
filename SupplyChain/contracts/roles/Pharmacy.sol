// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Roles.sol";

contract Pharmacy {

    using Roles for Roles.Role;
    Roles.Role private pharmacies;
    constructor () {
        addPharmacie (msg.sender);
    }
    modifier onlyPharmacie() {
    require(isPharmacie(msg.sender), "This account has no a Pharmacie Role");
    _;
  }
    function addPharmacie(address account) internal {
        pharmacies.add(account);
       
    }

    function removePharmacie(address account) internal {
        pharmacies.remove(account);
    }
    function isPharmacie(address account) public view returns (bool) {
        return pharmacies.has(account);
    }
}