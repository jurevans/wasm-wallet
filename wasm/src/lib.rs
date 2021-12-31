mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub struct Wallet {
    address: String,
}

#[wasm_bindgen]
pub struct Account {
    key: String,
    accounts: Vec<Wallet>,
}

#[wasm_bindgen]
impl Wallet {
    pub fn new() -> Self {
        utils::set_panic_hook();
        Self {
            address: "".to_string()
        }
    }

    pub fn set_address(&mut self, address: &str) {
        self.address = address.to_string()
    }

    pub fn get_address(&self) -> String {
        self.address.to_string()
    }
}

#[wasm_bindgen]
impl Account {
    pub fn new(key: &str) -> Self {
        Self {
            key: key.to_string(),
            accounts: Vec::new(),
        }
    }

    pub fn get_key(&self) -> String {
        self.key.to_string()
    }

    pub fn add_account(&mut self, wallet: Wallet) {
        self.accounts.push(wallet)
    }
}

#[wasm_bindgen]
pub fn loaded_message() {
    console_log!("WASM has been successfully loaded!")
}
