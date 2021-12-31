mod utils;

use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use std::collections::HashMap;
use bitcoin_wallet::mnemonic::Mnemonic;
use bitcoin_wallet::account::{MasterAccount,MasterKeyEntropy};
use bitcoin_wallet::bitcoin::network::constants::Network;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[derive(Serialize, Deserialize)]
pub struct Example {
    pub field1: HashMap<u32, String>,
    pub field2: Vec<Vec<f32>>,
    pub field3: [f32; 4],
}

#[allow(unused_variables)]
#[wasm_bindgen]
pub fn receive_example_from_js(val: &JsValue) {
    let example: Example = val.into_serde().unwrap();
    console_log!("Received JsValue");
}

#[wasm_bindgen]
pub fn send_example_to_js() -> JsValue {
    let mut field1 = HashMap::new();
    field1.insert(0, String::from("ex"));
    let example = Example {
        field1,
        field2: vec![vec![1., 2.], vec![3., 4.]],
        field3: [1., 2., 3., 4.]
    };

    JsValue::from_serde(&example).unwrap()
}

/// Generate a new random Mnemonic, as a test of what the frontend should see
/// `generate_mnemonic()` => `String`
#[wasm_bindgen]
pub fn generate_mnemonic(n: u32) -> String {
    utils::set_panic_hook();
    let security_level = match n {
        16 => MasterKeyEntropy::Sufficient,
        32 => MasterKeyEntropy::Double,
        64 => MasterKeyEntropy::Paranoid,
        _ => MasterKeyEntropy::Sufficient,
    };
    let result = Mnemonic::new_random(security_level);
    let mnemonic = result.unwrap();
    mnemonic.to_string()
}

fn get_mnemonic() -> Mnemonic {
    utils::set_panic_hook();
    let result = Mnemonic::new_random(MasterKeyEntropy::Sufficient);
    result.unwrap()
}

fn create_master_account(passphrase: String) -> MasterAccount {
    let mnemonic = get_mnemonic();
    MasterAccount::from_mnemonic(&mnemonic, 0, Network::Bitcoin, &passphrase, None).unwrap()
}

#[derive(Serialize, Deserialize)]
#[wasm_bindgen]
pub struct Account {
    id: u32,
    private_key: String,
    address: String,
}

#[derive(Serialize, Deserialize)]
#[wasm_bindgen]
pub struct Master {
    public_key: String,
    private_key: String,
    accounts: Option<Vec<Account>>,
}

#[allow(unused_variables)]
#[wasm_bindgen]
pub fn new_master_account(passphrase: String) -> Master {
    let master_account = create_master_account(passphrase);
    let public_key = String::from("test-public-key");
    let private_key = String::from("test-private-key");
    let accounts = None;

    Master {
        public_key,
        private_key,
        accounts
    }
}

/// Simply return true, confirming the WASM is returning data
/// to a client
/// `healthCheck()` => `bool`
#[wasm_bindgen]
pub fn health_check() -> bool {
    console_log!("WASM is connected to client!");
    true
}

/// Log loaded status to console
/// `loaded()` => void
#[wasm_bindgen]
pub fn loaded() {
    console_log!("WASM is loaded!");
}
