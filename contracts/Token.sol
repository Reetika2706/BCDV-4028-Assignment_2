// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyTokenNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
     mapping(string => uint8) existingURIs;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("MyToken", "RTNFT") {}

     function isContentOwned(string memory uri) public view returns (bool) {
        return existingURIs[uri] == 1;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }
    function _burn(uint256 tokenId) internal override(ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    function payToMint(
        address recipient,
        string[] memory metadataURIs
    ) public payable returns (uint256) {
        require(msg.value >= 0.05 ether * metadataURIs.length, 'Insufficient payment!');
       

       for (uint256 i = 0; i < metadataURIs.length; i++) {
            string memory metadataURI = metadataURIs[i];
            
            require(existingURIs[metadataURI] != 1, 'NFT already minted!');
            
            uint256 newItemId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            existingURIs[metadataURI] = 1;

            _mint(recipient, newItemId);
            _setTokenURI(newItemId, metadataURI);
        }
    }
}