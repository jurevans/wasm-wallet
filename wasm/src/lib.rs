mod utils;

use std::collections::HashMap;
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

#[derive(Serialize, Deserialize)]
#[wasm_bindgen]
pub struct MnemonicSerializable {
    mnemonic: String,
    level: u8,
}

#[wasm_bindgen]
impl MnemonicSerializable {
    pub fn new(level: u8) -> Self {
        let security_level = get_security_level(level);
        let result = Mnemonic::new_random(security_level);
        let mnemonic = result.unwrap();
        let mnemonic_str = mnemonic.to_string();

        Self {
            level,
            mnemonic: mnemonic_str,
        }
    }
}

fn get_security_level(level: u8) -> MasterKeyEntropy {
    match level {
        16 => MasterKeyEntropy::Sufficient,
        32 => MasterKeyEntropy::Double,
        64 => MasterKeyEntropy::Paranoid,
        _ => MasterKeyEntropy::Sufficient,
    }
}

pub fn get_mnemonic(level: u8) -> String {
    let security_level = get_security_level(level);
    let result = Mnemonic::new_random(security_level);
    let mnemonic = result.unwrap();
    mnemonic.to_string()
}

/// Serializable version of bitcoin-wallet MasterAccount
#[allow(dead_code)]
#[derive(Serialize, Deserialize)]
#[wasm_bindgen]
pub struct MasterAccountSerializable {
    mnemonic: MnemonicSerializable,
    encrypted: Vec<u8>,
    accounts: HashMap<(u32, u32), AccountSerializable>,
    master_public: ExtendedPubKeySerializable,
}

#[allow(unused_variables)]
#[wasm_bindgen]
impl MasterAccountSerializable {
    pub fn new(passphrase: &str, level: u8) -> JsValue {
        let mnemonic_str = get_mnemonic(level);
        let mnemonic = Mnemonic::from_str(&mnemonic_str);
        let master_acc = MasterAccountSerializable::create_master_account(passphrase, mnemonic.unwrap());
        let master_public = master_acc.master_public();

        let master_public_serializable = ExtendedPubKeySerializable {
            network: 0,
            depth: 1,
            parent_fingerprint: 1,
            child_number: 1,
            public_key: 1111111111,
            chain_code: 1,
        };

        let master = MasterAccountSerializable {
            mnemonic: MnemonicSerializable {
                level,
                mnemonic: mnemonic_str,
            },
            encrypted: master_acc.encrypted().to_vec(),
            accounts: HashMap::new(),
            master_public: master_public_serializable,
        };

        JsValue::from_serde(&master).unwrap()
    }

    fn create_master_account(passphrase: &str, mnemonic: Mnemonic) -> MasterAccount {
        MasterAccount::from_mnemonic(&mnemonic, 0, Network::Bitcoin, &passphrase, None).unwrap()
    }
}

/// Serializable version of bitcoin-wallet Account
#[derive(Serialize, Deserialize)]
#[wasm_bindgen]
pub struct AccountSerializable {
    address_type: u32,
    account_number: u32,
    sub_account_number: u32,
    look_ahead: u32,
}

/// BIP-32 extended public key
#[derive(Serialize, Deserialize)]
#[wasm_bindgen]
pub struct ExtendedPubKeySerializable {
    network: u8,                // <- Enum: Network
    depth: u8,                  // <- u8
    parent_fingerprint: u8,     // <- Fingerprint
    child_number: u8,           // <- ChildNumber
    public_key: u32,             // <- ECDSA
    chain_code: u8,             // <- ChainCode
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
