import React, { useState, useEffect } from "react";
import { getBalance, transferTokens } from "./tokenService";

function App() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");
  const account = "yklxw-q2g2g-3u6de-glprn-zcujc-qn7bm-aziql-briab-rssvl-z6gyp-qae";

  
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const fetchedBalance = await getBalance(account);
        setBalance(fetchedBalance);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setError("Failed to fetch balance");
      }
    };

    fetchBalance();
  }, []);

  const checkBalance = async () => { // Corrected checkBalance function
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
      const result = await transferTokens(recipient, parsedAmount);
      if (result) {
        alert("Transfer successful!");
        checkBalance();
        setRecipient("");
        setAmount("");
        setError("");
      } else {
        setError("Transfer failed");
      }
    } catch (err) {
      console.error("Transfer error:", err);
      setError("An error occurred during transfer");
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
          Balance: {balance} Tokens
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
    </div>
  );
}

export default App;
