import { useEffect, useState } from "react";

import { ethers } from "ethers";
import MyTokenNFT from "./../contracts/Token.sol/MyTokenNFT.json";
import Wallet from "./Wallet.js";

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, MyTokenNFT.abi, signer);

function Home() {
  const [totalMinted, setTotalMinted] = useState(0);
  const [cid, setCid] = useState('');

  useEffect(() => {
    getCount();
  }, []);

  const getCount = async () => {
    const count = await contract.connect();
  };

  return (
    <div>
      <Wallet />

      <h1>NFT Collection</h1>
      <label >Content Id</label>
      <input type="text" onChange={(e)=>setCid(e.target.value)} required/>
      <div className='container'>
        <div className='row'>
          {Array(totalMinted + 1)
            .fill(0)
            .map((_, i) => (
              <div key={i} className='col-sm'>
                <NFTImage tokenId={i} getCount={getCount} cid={cid} setCid={setCid} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function NFTImage({ tokenId, getCount,cid,setCid }) {
  const contentId = cid;
  const metadataURI = `${cid}/${tokenId}json`;
  const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}`;
  //   const imageURI = `img/${tokenId}.png`;

  const [isMinted, setIsMinted] = useState(false);
  useEffect(() => {
    // getMintedStatus();
  }, [isMinted]);

  const getMintedStatus = async () => {
    const result = await contract.connect(metadataURI);
    console.log(result);
    setIsMinted(result);
  };

  const mintToken = async () => {
    try {
      const connection = contract.connect(signer);
      const addr = connection.address;
      const result = await contract.payToMint(addr, [metadataURI], {
        value: ethers.utils.parseEther("0.05"),
      });
  
      await result.wait();
      getMintedStatus();
      getCount();
  } 
    catch (e) {
      console.log("errr",e);
  };
    
  };

  async function getURI() {
    const uri = await contract.tokenURI(tokenId);
    alert(uri);
  }
  return (
    <div className='card' style={{ width: "18rem" }}>
      <img
        className='card-img-top'
        // src={imageURI }
        src={isMinted ? imageURI : "img/placeholder.png"}
        style={{width:"50px",height:"50px"}}
      ></img>
      <div className='card-body'>
       {cid && <h5 className='card-title'>ID #{tokenId}</h5>}
      {!isMinted ? (
          <button className='btn btn-primary' onClick={mintToken}>
            Mint
          </button>
        ) : (
          <button className='btn btn-secondary' onClick={getURI}>
            Taken! Show URI
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;
