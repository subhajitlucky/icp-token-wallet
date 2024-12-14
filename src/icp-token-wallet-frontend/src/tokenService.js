import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory } from "./your_backend_idl";

const canisterId = "dmalx-m4aaa-aaaaa-qaanq-cai";

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
    const balance = await tokenActor.balance_of(account);
    console.log("Balance retrieved:", balance);
    return balance;
  } catch (error) {
    console.error("Detailed balance fetch error:", error);
    throw error;
  }
};

export const transferTokens = async (to, amount) => {
  try {
    console.log(`Attempting transfer: To ${to}, Amount ${amount}`);
    const result = await tokenActor.transfer(to, amount);
    console.log("Transfer result:", result);
    return result;
  } catch (error) {
    console.error("Detailed transfer error:", error);
    throw error;
  }
};
