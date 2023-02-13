//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Vykt is Ownable {
    uint256 internal price;
    mapping(address => string[]) internal addrImageURIs;

    receive() external payable {}

    fallback() external payable {}

    modifier priceCheck() {
        require(msg.value >= price, "Not enough BIT");
        _;
    }

    constructor(uint256 _price) {
        price = _price;
    }

    event ImageURIChanged(address indexed _addr, string _imageURI);

    event AllImageURIs(address indexed _addr, string[] _imageURIs);

    event PriceChanged(uint256 _price);

    event Withdraw(address indexed _addr, uint256 _amount);

    function setCurrentImageURI(string calldata _imageURI) public payable {
        require(msg.value >= getPrice(), "Not enough BIT");

        (bool sent, ) = address(this).call{value: msg.value}("");
        require(sent, "Failed to send BIT");

        addrImageURIs[msg.sender].push(_imageURI);
        emit ImageURIChanged(msg.sender, _imageURI);
        emit AllImageURIs(msg.sender, addrImageURIs[msg.sender]);
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
        emit PriceChanged(price);
    }

    function getPrice() public view returns (uint256) {
        return price;
    }

    function withdraw(uint256 _value) public onlyOwner {
        require(_value <= address(this).balance, "Not enough BIT");
        payable(msg.sender).transfer(_value);
        emit Withdraw(msg.sender, address(this).balance);
    }
}
