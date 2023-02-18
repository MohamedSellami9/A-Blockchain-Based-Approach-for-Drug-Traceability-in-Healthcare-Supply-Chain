// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Roles.sol";

contract Client {

    using Roles for Roles.Role;
    Roles.Role private clients;
    constructor () {
        addClient(msg.sender);
    }

    modifier onlyClient() {
    require(isClient(msg.sender), "This account has no a Client Role");
    _;
  } 

    function addClient(address account) public {
        clients.add(account);
       
    }

    function removeClient(address account) internal {
        clients.remove(account);
    }

    function isClient(address account) public view returns (bool) {
        return clients.has(account);
    }
    
}