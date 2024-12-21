use ic_cdk_macros::{init, query, update};
use std::collections::HashMap;
use ic_kit::ic;
use std::cell::RefCell;
use candid::{CandidType, Deserialize};

#[derive(CandidType, Deserialize, Clone)]
pub struct MetadataEntry {
    pub key: String,
    pub value: String,
}

thread_local! {
    static BALANCES: RefCell<HashMap<String, u64>> = RefCell::new(HashMap::new());
    static TOTAL_SUPPLY: RefCell<u64> = RefCell::new(0);
}

const TOKEN_NAME: &str = "MyToken";
const TOKEN_SYMBOL: &str = "MTK";
const TOKEN_DECIMALS: u8 = 8;
const INITIAL_ACCOUNT: &str = "yklxw-q2g2g-3u6de-glprn-zcujc-qn7bm-aziql-briab-rssvl-z6gyp-qae";
const INITIAL_BALANCE: u64 = 1_000_000;

#[init]
pub fn init() {
    ic_cdk::println!("Initializing token with account: {}", INITIAL_ACCOUNT);
    BALANCES.with(|balances| {
        let mut balances = balances.borrow_mut();
        balances.insert(INITIAL_ACCOUNT.to_string(), INITIAL_BALANCE);
        TOTAL_SUPPLY.with(|supply| *supply.borrow_mut() = INITIAL_BALANCE);
    });
}

#[query]
pub fn icrc2_metadata() -> Vec<MetadataEntry> {
    vec![
        MetadataEntry { key: "name".to_string(), value: TOKEN_NAME.to_string() },
        MetadataEntry { key: "symbol".to_string(), value: TOKEN_SYMBOL.to_string() },
        MetadataEntry { key: "decimals".to_string(), value: TOKEN_DECIMALS.to_string() },
    ]
}

#[query]
pub fn icrc2_total_supply() -> u64 {
    TOTAL_SUPPLY.with(|supply| *supply.borrow())
}

#[query]
pub fn icrc2_balance_of(account: String) -> u64 {
    BALANCES.with(|balances| balances.borrow().get(&account).copied().unwrap_or(0))
}

#[update]
pub fn icrc2_transfer(to: String, amount: u64) -> Result<bool, String> {
    let caller = ic::caller().to_string();
    ic_cdk::println!("Transfer request from {} to {} amount: {}", caller, to, amount);

    BALANCES.with(|balances| {
        let mut balances = balances.borrow_mut();
        let caller_balance = balances.get(&caller).copied().unwrap_or(0);
        if caller_balance < amount {
            return Err(format!("Insufficient balance: {} < {}", caller_balance, amount));
        }
        *balances.entry(caller.clone()).or_insert(0) -= amount;
        *balances.entry(to.clone()).or_insert(0) += amount;
        ic_cdk::println!("Transfer successful");
        Ok(true)
    })
}