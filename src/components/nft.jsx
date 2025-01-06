import React from 'react'
import { config } from './config'
import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { abi as nftABI, deployedaddr as nftAddress } from '../contract/nftinfo'
import { abi, deployedaddr } from '../contract/info'
import { useState, useEffect } from 'react'
import { readContract } from 'wagmi/actions'
import { formatEther, parseEther } from 'viem'
import { getNextKeyDef } from '@testing-library/user-event/dist/keyboard/getNextKeyDef'
const Nft = () => {



  const { data, writeContract, error, isSuccess } = useWriteContract()

  const { isError, isLoading } = useWaitForTransactionReceipt({
    hash: data,
    confirmations: 2,
    config
  })

  const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwNjY1OTNlNC0yMzY0LTRjZDQtOTRjOS0wNDY2NGZlNTNlNWYiLCJlbWFpbCI6ImFzaGFyLmEuaG1kMTFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjlmODBlOGFlYzFmOGJhOTdkYzdmIiwic2NvcGVkS2V5U2VjcmV0IjoiMDYxNzU3MWNjZjcxYTM1ZjFmOTU0MWEwYTA2YjAyZTVkM2QwMzcxMDYyODQ3NmJkNDE2MTI3MWVmMjBlMjZkNCIsImV4cCI6MTc2NzEzMDU4NH0.4BatoPAWHTJ9-aISbHQZOUUUEy9cPb3R2zUhg_S8L08";



  async function pinFileToIPFS(blob) {
    try {

      const file = new File([blob], "hello-world.jpeg")
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
        body: data,
      });
      const resData = await res.json();
      return resData
    } catch (error) {
      console.log(error);
    }
  };




  const connectedaddress = useAccount(config)
  // console.log(connectaddress.address);
  // console.log(connectedaddress.address);

  const currentUserETH = useBalance({
    address: connectedaddress.address,
  })

  const result = useReadContract({
    abi: nftABI,
    address: nftAddress,
    functionName: 'name',
  })

  const {data:balanceOfAsh} = useReadContract({
    abi,
    address: deployedaddr,
    functionName: 'balanceOf',
    args: [connectedaddress.address],
    watch:isLoading
  })

  // console.log(balanceOfAsh.data)

  const getNFTsBalance = useReadContract({
    abi: nftABI,
    address: nftAddress,
    functionName: 'balanceOf',
    args: [connectedaddress.address]

  })

  console.log()


  // console.log(getNFTsBalance.data.toString());

  const [allNFTs, setallNFTs] = useState([])


  // Usage



  const { data: getTokenOfOwnerByIndex, refetch } = useReadContract({
    abi: nftABI,
    address: nftAddress,
    functionName: 'tokenOfOwnerByIndex',
    args: [connectedaddress.address, 0], // placeholder index
    enabled: false, // Prevent automatic fetching

  })

  const refetchToken = async () => {

    const result = await readContract(config, {
      abi: nftABI,
      address: nftAddress,
      functionName: 'tokenOfOwnerByIndex',
      args: [connectedaddress.address, 0], // placeholder index
      // account:connectedaddress.address

    })

    // const finalData = await result
    console.log(result);


  }






  const getAllURIs = async () => {

    if (getNFTsBalance.data > 0) {
      let theData = []
      for (let i = 0; i < getNFTsBalance.data; i++) {
        const getTokenOfOwnerByIndex = await readContract(config, {
          abi: nftABI,
          address: nftAddress,
          functionName: 'tokenOfOwnerByIndex',
          args: [connectedaddress.address, i]

        })
        const tokenURI = await readContract(config, {
          abi: nftABI,
          address: nftAddress,
          functionName: 'tokenURI',
          args: [getTokenOfOwnerByIndex]

        })

        const response = await fetch(
          `https://ipfs.io/ipfs/${tokenURI.slice(7)}`,
          {
            headers: {
              // Authorization: "Bearer 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",
              "Content-Type": "application/json",
            },
            method: "GET",
            // body: JSON.stringify({ "inputs": `${Math.ceil(Math.random() * 10000)} random colourful zombie bored ape yacht club nft` }),
          }
        );
        const result = await response.json();


        // console.log(result);

        theData.push(result)

      }
      if (theData.length == getNFTsBalance.data) {

        setallNFTs(theData)
      }

    }

    // setallNFTs([...allNFTs, theData])
  }





  console.log(allNFTs);



  useEffect(() => {
    if (getNFTsBalance.data && allNFTs.length == 0) {
      getAllURIs()
    };
    // approveAsh()


    // refetchToken()
  }, [getNFTsBalance]);



  // useEffect(() => {
  //   approveAsh()
  // }, [])


  const processData = async () => {
    const uris = await getAllURIs()
    return uris
  }

  // console.log(getNFTsBalance.data);






  // console.log(getNFTs.data);







  const approveAsh = () => {
    writeContract({
      abi,
      address: deployedaddr,
      functionName: 'approve',
      args: [
        nftAddress,
        100000000000000000000n,
      ],
    })
  }


  const { data: allowances, isSuccess: allowancesSuccess } = useReadContract({
    abi,
    address: deployedaddr,
    functionName: 'allowance',
    args: [connectedaddress.address, nftAddress], // placeholder index
    watch: isLoading
  })





  console.log(error)
  // useEffect(() => {
  //   approveAsh()
  // }, [])


  const mintNFT = (jsonUri) => {
    writeContract({
      abi: nftABI,
      address: nftAddress,
      functionName: 'safeMint',
      args: [
        connectedaddress.address,
        `ipfs://${jsonUri}`,
      ],
    })
  }




  // console.log(parseEther((formatEther(balanceOfAsh.data)-100).toString()));


  console.log(result.data);


  const [generatedImage, setGeneratedImage] = useState(null)

  const [loader, setLoader] = useState(false)


  const blobToBase64 = async blob => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result)
      reader.onerror = err => reject(err)
      reader.readAsDataURL(blob)
    })
  }





  console.log(isLoading);


  async function generateNFTImage() {
    setLoader(true)
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
      {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ "inputs": `${Math.ceil(Math.random() * 10000)} random colourful zombie bored ape yacht club nft` }),
      }
    );
    const result = await response.blob();
    const base64img = await blobToBase64(result)
    console.log(result);

    setGeneratedImage(base64img)
    const ipfsHash = await pinFileToIPFS(result)
    const jsonIpfsHash = await pinJSON(ipfsHash.IpfsHash)



    mintNFT(jsonIpfsHash.IpfsHash)

    // console.log(jsonIpfsHash.IpfsHash);

    setLoader(false)


  }
  async function pinJSON(ipfshash) {

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${JWT}`,
          "Content-Type": "application/json",
        },


        body: JSON.stringify({
          description: "nft made by Ashar",
          external_url: "https://metatech-official.co/",
          type: "object",
          image: `https://ipfs.io/ipfs/${ipfshash}`,
          name: `NFT ${Math.ceil(Math.random() * 10000)}`,
          attributes: []

        })
      }
    );
    const result = await response.json()
    return result





  }





  


  console.clear()

  return (
    <div>
      <h1 className="text-center py-3">Mint NFT</h1>
      <div className="container">
        {/* {allowancesSuccess && <h1 className="text-center">{formatEther(allowances)}</h1>} */}
        <div className="d-flex justify-content-center flex-column">
          {!connectedaddress.address&&<div>
          <p className="text-center">Connect Your Wallet</p>
          </div>}
          {allowancesSuccess && <div className='d-flex justify-content-center'>

            <button disabled={formatEther(balanceOfAsh)>=100?allowances<100?false:true:true} onClick={() => approveAsh()} className={`btn btn-${formatEther(balanceOfAsh)>=100?allowances<100?"primary":"success":"secondary"} mx-2`}>{formatEther(balanceOfAsh)>=100?"APPROVE":"100 $ASH REQUIRED"}</button>
            <button disabled={allowances<100?true:false} onClick={() => generateNFTImage()} className="btn btn-primary">MINT</button>


          </div>}
          {Number(getNFTsBalance.data)==0&&<div>
          <p className="text-center">You Currently Own 0 NFTs</p>
          </div>}
          {loader && <div className="d-flex justify-content-center py-3">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>}
          
          {allowancesSuccess &&Number(getNFTsBalance.data)>0&&allNFTs.length==0&&<div className="d-flex justify-content-center py-3">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>}
         <div className="row my-4">

            {allNFTs.map((e) => {
              return <div className='col-6 col-md-4'><div class="card border-0 my-3" >
                <img src={e.image} class="card-img-top rounded-4" alt="..." />
                <h5 class="card-title my-2">{e.name}</h5>

                {/* <div class="card-body">
                  <h5 class="card-title">Card title</h5>
                  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  <a href="#" class="btn btn-primary">Go somewhere</a>
                </div> */}
              </div>
              </div>
            })}
            {generatedImage && <div className='col-6 col-md-4'><div class="card border-0 my-3" >
              <img src={generatedImage} class="card-img-top rounded-4" alt="..." />
              {/* <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" class="btn btn-primary">Go somewhere</a>
              </div> */}
            </div>
            </div>
            }
          </div>

          {/* https://ipfs.io/ipfs/QmSX7h8Hm6pFh7jHvv7CbrMjLGmFv3yDRMSnDCkYDZu3jD */}

        </div>
      </div>

    </div>
  )
}

export default Nft