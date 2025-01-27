import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../declarations/icp-token-wallet-backend/icp-token-wallet-backend.did.js';

const canisterId =process.env.CANISTER_ID_ICP_TOKEN_WALLET_BACKEND;

const agent = new HttpAgent({
  host: process.env.DFX_NETWORK === 'local' ? 'http://localhost:4943' : 'https://ic0.app',
});

// Only fetch the root key when in local development
if (process.env.DFX_NETWORK === 'local') {
  agent.fetchRootKey().catch(err => {
    console.warn('Unable to fetch root key. Check if your local replica is running');
    console.error(err);
  });
}

const tokenService = Actor.createActor(idlFactory, { agent, canisterId });

// Exported service functions
export const getBalance = (account) => tokenService.icrc2_balance_of(account);
export const getMetadata = () => tokenService.icrc2_metadata();
export const getTotalSupply = () => tokenService.icrc2_total_supply();

/**
 * Transfers tokens from the default account to the specified recipient.
 * @param {string} to - Recipient's account ID.
 * @param {number|string|bigint} amount - Amount of tokens to transfer.
 * @returns {Promise<boolean>} - Returns true if the transfer is successful.
 */
export const transferTokens = async (to, amount) => {
  try {
    const result = await tokenService.icrc2_transfer(to, BigInt(amount));
    if ('err' in result) {
      throw new Error(result.err);
    }
    return result.ok;
  } catch (error) {
    console.error('Transfer failed:', error);
    throw error;
  }
};


export const getPrincipalId = async () => {
  try {
    return await tokenService.get_principal_id();
  } catch (error) {
    console.error('Failed to get principal ID:', error);
    throw error;
  }
};