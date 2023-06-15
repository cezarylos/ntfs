// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "contracts/DefaultOperatorFilterer.sol";

contract NFT is ERC721, Ownable, DefaultOperatorFilterer {
    using Strings for uint256;

    uint256 public constant MAX_TOKENS = 75;
    uint256 private constant TOKENS_RESERVED = 65;
    uint256 private constant TOKENS_RESERVED_PER_PERSON = 5;
    uint256 private constant TOKENS_RESERVED_PER_COMMON_WALLET = 40;
    uint256 public price = 1000000000000000;
    uint256 public constant MAX_MINT_PER_TX = 1;

    bool public isSaleActive = true;
    uint256 public totalSupply;
    mapping(address => uint256) private mintedPerWallet;

    string public baseUri;
    string public baseExtension = ".json";

    address private commonWallet = 0x500303B77c971B4c1245fAd0B1a4e47dFb1C9112;

    constructor() ERC721("Spokooj", "SPK") {
        baseUri = "ipfs://bafybeibexngilm66luqdcwy6dsp4l5c6jdm5hpjwcc3x5kyybm4otlc5h4/";
        address[] memory addresses = new address[](5);

        addresses[0] = 0x3516d69C6574ba19168852Ec6AaA27099e1343e0;
        addresses[1] = 0x7E2BD1f135bA48d81F8aDD3910364E7Cb19D64B9;
        addresses[2] = 0x8E15337E9F858A5E1e7576487bD563215bA9eEDB;
        addresses[3] = 0x707C71BFCfEeeAD231201508D660d068F6524c23;
        addresses[4] = 0xDF3610D151852B1316C0C0c3167184D9d86d4335;

        for (uint256 i = 0; i < addresses.length; i++) {
            for (uint256 j = 0; j < TOKENS_RESERVED_PER_PERSON; j++) {
                uint256 tokenId = totalSupply + 1;
                _safeMint(addresses[i], tokenId);
                totalSupply++;
            }
        }

        // Mint tokens to commonWallet
        for (uint256 j = 0; j < TOKENS_RESERVED_PER_COMMON_WALLET; j++) {
            uint256 tokenId = totalSupply + 1;
            _safeMint(commonWallet, tokenId);
            totalSupply++;
        }
    }

    // Public Functions
    function getPrice(uint256 _amount) public view returns (uint256) {
        return (price * _amount);
    }

    function mint(address _to, uint256 _amount) public payable {
        require(isSaleActive, "The sale is paused.");
        require(
            _amount <= MAX_MINT_PER_TX,
            "You cannot mint that many in one transaction."
        );
        require(
            mintedPerWallet[_to] + _amount <= MAX_MINT_PER_TX,
            "You cannot mint that many total."
        );
        uint256 curTotalSupply = totalSupply;
        require(
            curTotalSupply + _amount <= MAX_TOKENS,
            "Exceeds total supply."
        );
        require(getPrice(_amount) <= msg.value, "Insufficient funds.");

        for (uint256 i = 1; i <= _amount; ++i) {
            _safeMint(_to, curTotalSupply + i);
        }
        mintedPerWallet[_to] += _amount;
        totalSupply += _amount;
    }

    function getTokensByOwner(address _owner)
    public
    view
    returns (uint256[] memory)
    {
        // Get the total number of tokens owned by the address
        uint256 tokenCount = balanceOf(_owner);

        // Create an array to store the token IDs
        uint256[] memory tokenIds = new uint256[](tokenCount);

        // Loop through all tokens owned by the address and store their IDs in the array
        uint256 currentIndex = 0;
        for (uint256 i = 1; i <= totalSupply; i++) {
            if (_exists(i) && ownerOf(i) == _owner) {
                tokenIds[currentIndex] = i;
                currentIndex++;
            }
        }

        // Return the array of token IDs
        return tokenIds;
    }

    // Owner-only functions
    function flipSaleState() external onlyOwner {
        isSaleActive = !isSaleActive;
    }

    function setBaseUri(string memory _baseUri) public onlyOwner {
        baseUri = _baseUri;
    }

    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

    function withdrawAll() external payable onlyOwner {
        uint256 balance = address(this).balance;
        payable(commonWallet).transfer(balance);
    }

    function withdraw() external payable onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Contract has no balance to withdraw");
        require(
            msg.sender == owner(),
            "Only the contract owner can withdraw funds"
        );
        payable(msg.sender).transfer(balance);
    }

    function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                abi.encodePacked(
                    currentBaseURI,
                    tokenId.toString(),
                    baseExtension
                )
            )
                : "";
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseUri;
    }

    // OpenSea Enforcer functions
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override onlyAllowedOperator {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override onlyAllowedOperator {
        super.safeTransferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override onlyAllowedOperator {
        super.safeTransferFrom(from, to, tokenId, data);
    }
}
