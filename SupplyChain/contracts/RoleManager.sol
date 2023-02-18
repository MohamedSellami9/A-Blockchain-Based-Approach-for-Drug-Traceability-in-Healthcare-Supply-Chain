// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./roles/Client.sol";
import "./roles/Distributor.sol";
import "./roles/Manufacturer.sol";
import "./roles/Pharmacy.sol";

contract RoleManager is Client,Distributor,Manufacturer,Pharmacy{
    function myRole() public view returns(
        bool client,
        bool distributor,
        bool manufacturer,
        bool pharmacy
    ){
    client = isClient(msg.sender);
    distributor= isDistributor(msg.sender);
    manufacturer= isManufacturer(msg.sender);
    pharmacy= isPharmacie(msg.sender);
    }
}