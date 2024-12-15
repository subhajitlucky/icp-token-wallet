use ic_cdk_macros::{init, query, update};

use std::collections::HashMap;
use ic_kit::ic;
use std::cell::RefCell;
use candid::{CandidType, Deserialize};


#[derive(CandidType, Deserialize)]
struct MetadataEntry {
    key: String,
    value: String,
}


// Define a simple ledger state
thread_local! {
    static BALANCES: RefCell<HashMap<String, u64>> = RefCell::new(HashMap::new());
    static ALLOWANCES: RefCell<HashMap<(String, String), (u64, Option<u64>)>> = RefCell::new(HashMap::new()); // (owner, spender) -> (amount, expires_at)
    static TOTAL_SUPPLY: RefCell<u64> = RefCell::new(0);
}

// Initialize the token metadata
const TOKEN_NAME: &str = "MyToken";
const TOKEN_SYMBOL: &str = "MTK";
const TOKEN_DECIMALS: u8 = 8;

#[init]
pub fn init() {
    BALANCES.with(|balances| {
        let mut balances = balances.borrow_mut();
        balances.insert("yklxw-q2g2g-3u6de-glprn-zcujc-qn7bm-aziql-briab-rssvl-z6gyp-qae".to_string(), 1_000_000);
        TOTAL_SUPPLY.with(|supply| *supply.borrow_mut() = 1_000_000);
    });
}

/// Returns the token's metadata
#[query]
pub fn icrc2_metadata() -> Vec<MetadataEntry> {
    vec![
        MetadataEntry {
            key: "name".to_string(),
            value: TOKEN_NAME.to_string(),
        },
        MetadataEntry {
            key: "symbol".to_string(),
            value: TOKEN_SYMBOL.to_string(),
        },
        MetadataEntry {
            key: "decimals".to_string(),
            value: TOKEN_DECIMALS.to_string(),
        },
    ]
}

/// Returns the total supply of the token
#[query]
pub fn icrc2_total_supply() -> u64 {
    TOTAL_SUPPLY.with(|supply| *supply.borrow())
}

/// Returns the balance of a specific account
#[query]
pub fn icrc2_balance_of(account: String) -> u64 {
    BALANCES.with(|balances| {
        let balance = balances.borrow().get(&account).cloned().unwrap_or(0);
        ic_cdk::println!("Balance for account {}: {}", account, balance);
        balance
    })
    
}

/// Transfers tokens from the caller to a recipient, with an optional memo
#[update]
pub fn icrc2_transfer(to: String, amount: u64, memo: Option<String>) -> Result<(), String> {
    let caller = ic::caller().to_string();
    BALANCES.with(|balances| -> Result<(), String> {
        let mut balances = balances.borrow_mut();

        // Check if caller has enough balance
        if let Some(balance) = balances.get_mut(&caller) {
            if *balance < amount {
                return Err("Insufficient balance".to_string());
            }
            *balance -= amount; // Deduct from caller
        } else {
            return Err("Caller does not have an account".to_string());
        }

        // Add amount to recipient
        let recipient_balance = balances.entry(to.clone()).or_insert(0);
        *recipient_balance += amount;

        Ok(())
    })?; // Propagate errors

    // Optionally log the memo
    if let Some(m) = memo {
        ic_cdk::println!("Transfer memo: {}", m);
    }

    Ok(())
}


/// Approves a spender to use tokens on behalf of the caller, with an optional expiry time
#[update]
pub fn icrc2_approve(spender: String, amount: u64, expires_at: Option<u64>) -> Result<(), String> {
    let owner = ic::caller().to_string();
    ALLOWANCES.with(|allowances| {
        let mut allowances = allowances.borrow_mut();
        allowances.insert((owner, spender), (amount, expires_at));
    });

    Ok(())
}

/// Returns the allowance a spender has on behalf of an owner
#[query]
pub fn icrc2_allowance(owner: String, spender: String) -> (u64, Option<u64>) {
    ALLOWANCES.with(|allowances| {
        allowances.borrow().get(&(owner, spender)).cloned().unwrap_or((0, None))
    })
}
