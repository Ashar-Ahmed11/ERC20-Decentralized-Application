import React from "react";
// import { ConnectKitButton } from "connectkit";
import { useReadContract, useWriteContract } from 'wagmi'
import { abi, deployedaddr } from '../contract/info.jsx'
import { formatEther, parseEther } from 'viem'
import { useAccount } from "wagmi";
import { config } from "./config.jsx";

import { useState,useEffect } from "react";
import { useBalance } from 'wagmi'
import { useWaitForTransactionReceipt } from 'wagmi'
// import { useWriteContract } from "wagmi"

// import './App.css';

function Swap() {


  const connectedaddress = useAccount(config)
  // console.log(connectaddress.address);
  const currentUserETH = useBalance({
    address: connectedaddress.address,
  })

 



  const { data,writeContract, error, isSuccess } = useWriteContract(
    
  )
  
  // const transaction = useWaitForTransactionReceipt({})
  const {isError,isLoading} = useWaitForTransactionReceipt({
    hash: data,
    confirmations:2,
    config
  })

  console.log(`This is the data=> ${data}`);
  

  console.log(isLoading);
  


  // useEffect(() => {
  //   first
  
  //   return () => {
  //     second
  //   }
  // }, [result])
  
  console.log(writeContract);
  

  function swapToken() {
    if (currentSwap == "ASH"){
      writeContract({
        abi,
        address: deployedaddr,
        functionName: 'buyToken',
      
        value: parseEther(`${input1 / 10000}`)
        
      })


      // const thetransaction = transaction({hash:writeContract})
      // console.log(thetransaction);
      
    }
      
    else {
      writeContract({
        abi,
        address: deployedaddr,
        functionName: 'sellToken',
        args: [`${input1 * 10 ** 22}`]

      })
    }
  }


  
  

  

  

  console.log(isSuccess);
  
 

  console.log(error && error.shortMessage);






  // console.log(data);

  // console.log(totalSupply);

  // console.log(!isPending&&formatEther(totalSupply));

  // console.log(deployedaddr);


  const [currentSwap, setCurrentSwap] = useState("ASH")

  const [input1, setInput1] = useState(0)
  // console.log(parseEther(`${input1*10000}`));
  const { data: totalSupply, isPending } = useReadContract({
    abi,
    address: deployedaddr,
    functionName: 'balanceOf',
    args: [`${connectedaddress.address}`],
    watch:isLoading
  })  


  console.clear()

  return (
    <div >


      <div style={{ height: "90px" }}>
        <div style={{ transition: "all ease 1s", opacity: error && error.shortMessage ? 1 : 0 }} class="alert alert-danger" role="alert">
          {error && error.shortMessage ? error.shortMessage : ""}
        </div>
      </div>
      {/* <h1>Current Balance</h1> */}
      <div className="container">
        <h1 style={{fontFamily:"customFont"}} className="text-center">
          {/* {isPending ? "0 ASH" : totalSupply ? `${formatEther(totalSupply)} ASH` : "0 ASH"}\ */}
          Swap $ASH
        </h1>

        {/* {window.Error.message} */}

        <div className="d-flex justify-content-center">
          <button onClick={() => { currentSwap == "ETH" && setCurrentSwap("ASH") }} className={`btn border-1 border-primary m-1 ${currentSwap == "ASH" ? "btn-primary" : ""}`}>ASH</button>
          <button onClick={() => { currentSwap == "ASH" && setCurrentSwap("ETH") }} className={`btn border-1 border-primary m-1 ${currentSwap !== "ASH" ? "btn-primary" : ""}`}>ETH</button>
        </div>
        {/* <ConnectKitButton /> */}

        <div className="d-flex flex-column align-items-center">
          <div style={{ width: "50vw" }} class="card m-1">
            {/* <img src="..." class="card-img-top" alt="..."> */}

            <div class="card-body">
              <div className="d-flex justify-content-between">
                <h5 class="card-title">BUY</h5>
                <h5>{currentSwap}</h5>
              </div>
              <input type="text" placeholder="amount to sell" onChange={(e) => setInput1(e.target.value)} value={input1} className="form-control" />
              <p className="text-end m-0">Current Balance: {currentSwap == "ASH" ? isPending ? "0 ASH" : totalSupply ? `${formatEther(totalSupply)} ASH` : "0 ASH" : currentUserETH.data ? currentUserETH.data.formatted.slice(0, 7) : "0.0000"}</p>
              {/* <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
              {/* <button onClick={() => buyToken()} class="btn btn-primary">Buy Token</button> */}
            </div>


          </div>
          <div style={{ width: "50vw" }} class="card m-1">
            {/* <img src="..." class="card-img-top" alt="..."> */}

            <div class="card-body">
              <div className="d-flex justify-content-between">
                <h5 class="card-title">SELL</h5>
                <h5>{currentSwap == "ASH" ? "ETH" : "ASH"}</h5>
              </div>
              <input type="text" disabled style={{ backgroundColor: "white" }} placeholder="amount to buy" value={currentSwap == "ASH" ? input1 / 10000 : input1 * 10000} className="form-control" />
              <p className="text-end m-0">Current Balance: {currentSwap !== "ASH" ? isPending ? "0 ASH" : totalSupply ? `${formatEther(totalSupply)} ASH` : "0 ASH" : currentUserETH.data ? currentUserETH.data.formatted.slice(0, 7) : "0.0000"}</p>
             
              {/* <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
              {/* <button onClick={() => buyToken()} class="btn btn-primary">Buy Token</button> */}
            </div>


          </div>
          <button onClick={() => swapToken()} className="btn btn-primary m-1" style={{ width: "50vw" }}>Swap Tokens</button>
          {/* <div class="card m-2" >
            <img src="..." class="card-img-top" alt="..."/>

            <div class="card-body">
              <h5 class="card-title text-center">SELL</h5>
              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" class="btn btn-primary">SELL</a>
            </div>

          </div> */}
        </div>
        {isLoading  && <div className="d-flex justify-content-center m-2">
          <div class="spinner-grow text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>}
      </div>
    </div >
  );
}

export default Swap;
