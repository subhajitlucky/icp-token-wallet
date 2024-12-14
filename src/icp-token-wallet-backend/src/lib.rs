
use ic_kit::ic;
use ic_cdk_macros::{init, query, update};
use std::collections::HashMap;
use ic_cdk::println;

// Define a simple ledger state
thread_local! {
    static BALANCES: std::cell::RefCell<HashMap<String, u64>> = std::cell::RefCell::new(HashMap::new());
    static ALLOWANCES: std::cell::RefCell<HashMap<(String, String), u64>> = std::cell::RefCell::new(HashMap::new());
}

#[init]
pub fn init() {
    // Initialize with some default state if needed
    BALANCES.with(|balances| {
        balances.borrow_mut().insert("yklxw-q2g2g-3u6de-glprn-zcujc-qn7bm-aziql-briab-rssvl-z6gyp-qae".to_string(), 1000000); // Use a simpler account ID for testing
    });
}

#[query]
pub fn balance_of(account: String) -> u64 {
    
    let balance = BALANCES.with(|balances| {
        balances.borrow().get(&account).cloned().unwrap_or(0)
    });
    println!("Returned balance: {}", balance);
    balance
}



#[update]
pub fn transfer(to: String, amount: u64) -> bool {
    let caller = ic::caller().to_string();
    BALANCES.with(|balances| {
        let mut balances_mut = balances.borrow_mut();

        // Check if caller has sufficient balance
        let caller_balance = balances_mut.get(&caller).cloned().unwrap_or(0);
        if caller_balance < amount {
            return false;
        }

        // Deduct from caller
        balances_mut.insert(caller.clone(), caller_balance - amount);

        // Add to recipient
        let recipient_balance = balances_mut.get(&to).cloned().unwrap_or(0);
        balances_mut.insert(to, recipient_balance + amount);

        true
    })
}

#[update]
pub fn approve(spender: String, amount: u64) -> bool {
    let owner = ic::caller().to_string();
    ALLOWANCES.with(|allowances| {
        let mut allowances_mut = allowances.borrow_mut();
        allowances_mut.insert((owner, spender), amount);
        true
    })
}

#[query]
pub fn allowance(owner: String, spender: String) -> u64 {
    ALLOWANCES.with(|allowances| {
        allowances.borrow().get(&(owner, spender)).cloned().unwrap_or(0)
    })
}
