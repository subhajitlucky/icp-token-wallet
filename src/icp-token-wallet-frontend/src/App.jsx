import React, { useState, useEffect } from "react";
import { getBalance, getMetadata, getTotalSupply, transferTokens } from "./tokenService";
import "./index.scss";

const App = () => {
  const [balance, setBalance] = useState(0n);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
 

  const DEFAULT_ACCOUNT = "yklxw-q2g2g-3u6de-glprn-zcujc-qn7bm-aziql-briab-rssvl-z6gyp-qae";

  const handleMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const checkBalance = async (account) => {
    setLoading(true);
    try {
      const fetchedBalance = await getBalance(account);
      setBalance(BigInt(fetchedBalance));
    } catch (error) {
      console.error("Error in checkBalance:", error);
      handleMessage("error", "Failed to fetch balance");
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    setLoading(true);
    try {
      const data = await getMetadata();
      setMetadata(data);
    } catch (error) {
      console.error("Error in fetchMetadata:", error);
      handleMessage("error", "Failed to fetch metadata");
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalSupply = async () => {
    setLoading(true);
    try {
      const data = await getTotalSupply();
      setTotalSupply(BigInt(data));
    } catch (error) {
      console.error("Error in fetchTotalSupply:", error);
      handleMessage("error", "Failed to fetch total supply");
    } finally {
      setLoading(false);
    }
  };

  const validateTransfer = () => {
    if (!recipient) {
      handleMessage("error", "Please enter a recipient address");
      return false;
    }
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      handleMessage("error", "Please enter a valid amount");
      return false;
    }
    if (BigInt(parsedAmount) > balance) {
      handleMessage("error", "Insufficient balance");
      return false;
    }
    return true;
  };

  const sendTokens = async () => {
    if (!validateTransfer()) return;
    setLoading(true);
    try {
      const transferResult = await transferTokens(recipient, BigInt(amount));
      if (transferResult) {
        handleMessage("success", "Transfer successful!");
        await checkBalance(DEFAULT_ACCOUNT);
        setRecipient("");
        setAmount("");
      } else {
        handleMessage("error", "Transfer failed");
      }
    } catch (error) {
      console.error("Error in sendTokens:", error);
      handleMessage("error", error.message || "An error occurred during transfer");
    } finally {
      setLoading(false);
    }
  };

  // // Fetch initial data on component mount
  // useEffect(() => {
  //   checkBalance(DEFAULT_ACCOUNT);
  //   fetchMetadata();
  //   fetchTotalSupply();
  // }, []);

  return (
    <div className="app-container">
      <h2 className="title">Token Wallet</h2>

      {loading && <div className="loading">Loading...</div>}
      {message.text && <div className={`${message.type}-message`}>{message.text}</div>}

      <div className="balance-container">
        <button onClick={() => checkBalance(DEFAULT_ACCOUNT)} className="button check-balance-button" disabled={loading}>
          Check Balance
        </button>
        <p className="balance-text">Balance: {balance.toString()} Tokens</p>
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          disabled={loading}
          className="input"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
          className="input"
        />
        <button onClick={sendTokens} disabled={loading} className="button send-tokens-button">
          Send Tokens
        </button>
      </div>

      <div className="metadata-container">
        <button onClick={fetchMetadata} disabled={loading} className="button fetch-metadata-button">
          Fetch Metadata
        </button>
        {metadata && (
          <div className="metadata">
            <h3>Metadata:</h3>
            <ul>
              {metadata.map((entry, index) => (
                <li key={index}>
                  <strong>{entry.key}:</strong> {entry.value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="supply-container">
        <button onClick={fetchTotalSupply} disabled={loading} className="button fetch-total-supply-button">
          Fetch Total Supply
        </button>
        <p>Total Supply: {totalSupply ? totalSupply.toString() : "N/A"}</p>
      </div>
    </div>
  );
};

export default App;