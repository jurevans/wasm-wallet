mod utils;

use serde::{Serialize,Deserialize};
use wasm_bindgen::prelude::*;
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

#[allow(dead_code)]
#[derive(Serialize, Deserialize)]
#[wasm_bindgen]
pub struct Master {
    mnemonic: String,
    level: u32,
}

#[allow(unused_variables)]
#[wasm_bindgen]
impl Master {
    pub fn new(passphrase: String, level: u32) -> JsValue {
        utils::set_panic_hook();
        let security_level = match level {
            16 => MasterKeyEntropy::Sufficient,
            32 => MasterKeyEntropy::Double,
            64 => MasterKeyEntropy::Paranoid,
            _ => MasterKeyEntropy::Sufficient,
        };
        let result = Mnemonic::new_random(security_level);
        let mnemonic = result.unwrap();
        let mnemonic_string = mnemonic.to_string();
        let master_acc = Master::create_master_account(passphrase, mnemonic);

        let master = Master {
            mnemonic: mnemonic_string,
            level,
        };

        JsValue::from_serde(&master).unwrap()
    }

    fn create_master_account(passphrase: String, mnemonic: Mnemonic) -> MasterAccount {
        MasterAccount::from_mnemonic(&mnemonic, 0, Network::Bitcoin, &passphrase, None).unwrap()
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

/// Log a message to console on start
/// `run_start()` => void
#[wasm_bindgen(start)]
pub fn run_start() {
    console_log!("WASM is loaded!");
}
