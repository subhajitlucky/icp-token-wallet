import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory } from "./your_backend_idl";

const canisterId = "dxfxs-weaaa-aaaaa-qaapa-cai";

const agent = new HttpAgent({
  host: "http://127.0.0.1:4943"
});

agent.fetchRootKey().catch(err => {
  console.warn("Unable to fetch root key. Check to ensure that you are running your local replica.");
  console.error(err);
});

const tokenActor = Actor.createActor(idlFactory, {
  agent,
  canisterId,
});

export const getBalance = async (account) => {
  try {
    console.log("Fetching balance for account:", account);
    const balance = await tokenActor.icrc2_balance_of(account);
    console.log("Balance retrieved:", balance);
    return balance;
  } catch (error) {
    console.error("Detailed balance fetch error:", error);
    throw error;
  }
};

export const transferTokens = async (to, amount, memo = null) => {
  try {
    console.log(`Attempting transfer: To ${to}, Amount ${amount}, Memo: ${memo}`);
    const result = await tokenActor.icrc2_transfer(to, amount, memo);
    console.log("Transfer result:", result);
    return result;
  } catch (error) {
    console.error("Detailed transfer error:", error);
    throw error;
  }
};

export const approveSpender = async (spender, amount, expiresAt = null) => {
  try {
    console.log(`Approving spender: Spender ${spender}, Amount ${amount}, ExpiresAt: ${expiresAt}`);
    const result = await tokenActor.icrc2_approve(spender, amount, expiresAt);
    console.log("Approval result:", result);
    return result;
  } catch (error) {
    console.error("Detailed approval error:", error);
    throw error;
  }
};

export const getAllowance = async (owner, spender) => {
  try {
    console.log(`Fetching allowance: Owner ${owner}, Spender ${spender}`);
    const allowance = await tokenActor.icrc2_allowance(owner, spender);
    console.log("Allowance retrieved:", allowance);
    return allowance;
  } catch (error) {
    console.error("Detailed allowance fetch error:", error);
    throw error;
  }
};

export const getMetadata = async () => {
  try {
    console.log("Fetching token metadata");
    const metadata = await tokenActor.icrc2_metadata();
    console.log("Metadata retrieved:", metadata);
    return metadata;
  } catch (error) {
    console.error("Detailed metadata fetch error:", error);
    throw error;
  }
};

export const getTotalSupply = async () => {
  try {
    console.log("Fetching total supply");
    const totalSupply = await tokenActor.icrc2_total_supply();
    console.log("Total supply retrieved:", totalSupply);
    return totalSupply;
  } catch (error) {
    console.error("Detailed total supply fetch error:", error);
    throw error;
  }
};
