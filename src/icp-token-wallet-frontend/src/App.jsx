import React, { useState } from "react";
import { 
  getBalance, 
  transferTokens, 
  approveSpender, 
  getAllowance, 
  getMetadata, 
  getTotalSupply 
} from "./tokenService";

function App() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [spender, setSpender] = useState("");
  const [allowance, setAllowance] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [error, setError] = useState("");
  const [memo, setMemo] = useState("");

  const account = "yklxw-q2g2g-3u6de-glprn-zcujc-qn7bm-aziql-briab-rssvl-z6gyp-qae";

  const checkBalance = async () => {
    try {
      const fetchedBalance = await getBalance(account);
      setBalance(fetchedBalance);
      setError("");
    } catch (error) {
      console.error("Error checking balance:", error);
      setError("Failed to fetch balance");
    }
  };

  const sendTokens = async () => {
    if (!recipient) {
      setError("Please enter a recipient address");
      return;
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      const result = await transferTokens(recipient, parsedAmount, memo || null);
      if (result) {
        alert("Transfer successful!");
        checkBalance();
        setRecipient("");
        setAmount("");
        setMemo("");
        setError("");
      } else {
        setError("Transfer failed");
      }
    } catch (err) {
      console.error("Transfer error:", err);
      setError("An error occurred during transfer");
    }
  };

  const approveTokenSpender = async () => {
    const parsedAmount = Number(amount);
    if (!spender || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please provide valid spender and amount");
      return;
    }

    try {
      const result = await approveSpender(spender, parsedAmount);
      if (result) {
        alert("Approval successful!");
        setSpender("");
        setAmount("");
        setError("");
      } else {
        setError("Approval failed");
      }
    } catch (err) {
      console.error("Approval error:", err);
      setError("An error occurred during approval");
    }
  };

  const checkAllowance = async () => {
    if (!spender) {
      setError("Please enter a spender address");
      return;
    }

    try {
      const fetchedAllowance = await getAllowance(account, spender);
      setAllowance(fetchedAllowance);
      setError("");
    } catch (error) {
      console.error("Error fetching allowance:", error);
      setError("Failed to fetch allowance");
    }
  };

  const fetchMetadata = async () => {
    try {
      const fetchedMetadata = await getMetadata();
      setMetadata(fetchedMetadata);
      setError("");
    } catch (error) {
      console.error("Error fetching metadata:", error);
      setError("Failed to fetch metadata");
    }
  };

  const fetchTotalSupply = async () => {
    try {
      const fetchedTotalSupply = await getTotalSupply();
      setTotalSupply(fetchedTotalSupply);
      setError("");
    } catch (error) {
      console.error("Error fetching total supply:", error);
      setError("Failed to fetch total supply");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Token Wallet</h2>

      <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '6px', marginBottom: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <button onClick={checkBalance} style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Check Balance
        </button>
        <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#2196F3', marginTop: '10px' }}>
          Balance: {balance.toString()} Tokens
        </p>
      </div>

      {error && (
        <div style={{ backgroundColor: '#ffdddd', color: 'red', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => { setRecipient(e.target.value); setError(""); }}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <input
          type="text"
          placeholder="Memo (optional)"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => { setAmount(e.target.value); setError(""); }}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <button
          onClick={sendTokens}
          style={{ width: '100%', padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Send Tokens
        </button>
      </div>

      <h3 style={{ marginTop: '20px', color: '#333' }}>Additional Features</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Spender Address"
          value={spender}
          onChange={(e) => { setSpender(e.target.value); setError(""); }}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <button onClick={approveTokenSpender} style={{ width: '100%', padding: '10px', backgroundColor: '#FFA500', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Approve Spender
        </button>
        <button onClick={checkAllowance} style={{ width: '100%', padding: '10px', backgroundColor: '#8A2BE2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Check Allowance
        </button>
        <p>Allowance: {allowance ? allowance.toString() : "N/A"}</p>
        <button onClick={fetchMetadata} style={{ width: '100%', padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Fetch Metadata
        </button>
        <p>Metadata: {metadata ? JSON.stringify(metadata) : "N/A"}</p>
        <button onClick={fetchTotalSupply} style={{ width: '100%', padding: '10px', backgroundColor: '#28A745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Fetch Total Supply
        </button>
        <p>Total Supply: {totalSupply ? totalSupply.toString() : "N/A"}</p>
      </div>
    </div>
  );
}

export default App;
