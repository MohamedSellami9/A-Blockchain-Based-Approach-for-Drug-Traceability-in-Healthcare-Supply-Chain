// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library Roles {
  struct Role {
    mapping (address => bool) roles;
  }
function has(Role storage role, address account)internal view returns (bool){
    return role.roles[account];
 }
function add(Role storage role, address account)internal  {
    require(!has(role, account), "This address already has this role");
    role.roles[account] = true;
}
function remove(Role storage role, address account)internal {
    require(has(role, account), "This address does not have this role yet");
    role.roles[account] = false;
  }

}

