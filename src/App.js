import { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import faucetContract from "./ethereum/faucet"


function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState("");  
  const [faucet, setFaucet] = useState("");
  const [withdrawError, setWithdrawError] = useState("")
  const [ withdrawSuccess  , setWithdrawSuccess ]  = useState("")
  const [ transactionData, setTransactionData] = useState("")


  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {

        // Provider Settings
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // Account Settings
        const accounts = await provider.send("eth_requestAccounts", []);
        // Get Signer
        setSigner(provider.getSigner()); 
        // Local Contract Instance
        setFaucet(faucetContract(provider));

        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
         // Provider Settings
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         // Account Settings
         const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
         // Get Signer
         setSigner(provider.getSigner()); 
         // Local Contract Instance
         setFaucet(faucetContract(provider));
          setWalletAddress(accounts[0]);
          console.log(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };

  const OCTHandler = async () => {
    setWithdrawError("")
    setWithdrawSuccess("")
    try {
      const faucetContractWithSigner = faucet.connect(signer)
      const resp = await faucetContractWithSigner.requestTokens();
      console.log(resp)
      setWithdrawSuccess("Transaction Suceeded")
      setTransactionData(resp.hash)

    } catch (error) {
      console.err("err.message")
      setWithdrawError("err.message")
    }
  }

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1 className="navbar-item is-size-4">Ocean Token (OCT)</h1>
          </div>
          <div id="navbarMenu" className="navbar-menu">
            <div className="navbar-end is-align-items-center">
              <button
                className="button is-white connect-wallet"
                onClick={connectWallet}
              >
                <span className="is-link has-text-weight-bold">
                  {walletAddress && walletAddress.length > 0
                    ? `Connected: ${walletAddress.substring(
                        0,
                        6
                      )}...${walletAddress.substring(38)}`
                    : "Connect Wallet"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <section className="hero is-fullheight">
        <div className="faucet-hero-body">
          <div className="container has-text-centered main-content">
            <h1 className="title is-1">Faucet</h1>
            <p>Fast and reliable. 50 OCT/day.</p>
            <div className="mt-5" >
              {withdrawError && (
                <div className="withdraw-error">{withdrawError}</div>
              )}
              {withdrawSuccess && (
                <div className="withdraw-error">{withdrawSuccess}</div>
              )}{" "}
            </div>
            <div className="box address-box">
              <div className="columns">
                <div className="column is-four-fifths">
                  <input
                    className="input is-medium"
                    type="text"
                    placeholder="Enter your wallet address (0x...)"
                    defaultValue={walletAddress}
                  />
                </div>
                <div className="column">
                  <button className="button is-link is-medium" onClick={OCTHandler}
                  disabled= {walletAddress ? false : true}
                  >
                    GET TOKENS
                  </button>
                </div>
              </div>
              <article className="panel is-grey-darker">
                <p className="panel-heading">Transaction Data</p>
                <div className="panel-block">
                  <p>{transactionData ? `Transaction Hash: ${transactionData}` : "--" }</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
