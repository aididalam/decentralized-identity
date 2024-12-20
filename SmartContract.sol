// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IdentityManagement {
    struct User {
        string name;
        string email;
        address owner;
        bool isRegistered;
    }

    mapping(address => User) private users;

    event UserRegistered(address indexed user, string name, string email);
    event AccessGranted(address indexed user, address indexed verifier);
    event AccessRevoked(address indexed user, address indexed verifier);

    function registerUser(string memory _name, string memory _email) public {
        require(!users[msg.sender].isRegistered, "User already registered.");
        users[msg.sender] = User(_name, _email, msg.sender, true);
        emit UserRegistered(msg.sender, _name, _email);
    }

    function getUser(address _user) public view returns (string memory, string memory) {
        require(users[_user].isRegistered, "User not found.");
        return (users[_user].name, users[_user].email);
    }
}
