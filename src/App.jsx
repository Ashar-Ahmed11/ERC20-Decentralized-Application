import React from "react";
// import { ConnectKitButton } from "connectkit";
import { useReadContract, useWriteContract } from 'wagmi'
import { abi, deployedaddr } from './contract/info.jsx'
import { formatEther, parseEther } from 'viem'
import { useAccount } from "wagmi";
import { config } from "./components/config.jsx";
import Navbar from "./components/navbar.jsx";
import { useState, useEffect } from "react";
import { useBalance } from 'wagmi'
import { useWaitForTransactionReceipt } from 'wagmi'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Nft from "./components/nft.jsx";
import Swap from "./components/swap.jsx";
// import { useWriteContract } from "wagmi"

// import './App.css';

function App() {


  return (
    <Router>
      <div >
      <Navbar/>
       

        <Switch>
          <Route exact path="/">
            <Swap />
          </Route>
          <Route exact path="/erc721">
            <Nft />
          </Route>
         

        </Switch>
      </div>

    </Router >
  );
}

export default App;
