//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Vykt is Ownable {
    uint256 public price;
    mapping(address => string[]) public addrImageURIs;

    modifier priceCheck() {
        require(msg.value >= price, "Not enough BIT");
        _;
    }

    constructor(uint256 _price) {
        price = _price;
    }

    event CurrentImageURI(address indexed _addr, string _imageURI);
    event ImageURIs(address indexed _addr, string[] _imageURIs);

    function addImageURI(string calldata _imageURI) public payable {
        require(msg.value >= price, "Not enough BIT");
        (bool sent, ) = msg.sender.call{value: msg.value}("");
        require(sent, "Failed to send BIT");

        addrImageURIs[msg.sender].push(_imageURI);
        emit ImageURIs(msg.sender, addrImageURIs[msg.sender]);
        emit CurrentImageURI(msg.sender, _imageURI);
    }

    function getImageURIs(address _addr) public view returns (string[] memory) {
        return addrImageURIs[_addr];
    }

    function getCurrentImageURI(address _addr)
        public
        view
        returns (string memory)
    {
        return addrImageURIs[_addr][addrImageURIs[_addr].length - 1];
    }

    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

    function getPrice() public view returns (uint256) {
        return price;
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    receive() external payable {}

    fallback() external payable {}
}
