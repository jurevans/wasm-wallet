mod utils;

use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use std::collections::HashMap;
use bitcoin_wallet::mnemonic::Mnemonic;
use bitcoin_wallet::account::{MasterKeyEntropy};

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

/// Generate a new random Mnemonic
/// `generate_mnemonic()` => `String`
#[wasm_bindgen]
pub fn generate_mnemonic() -> String {
    utils::set_panic_hook();
    let result = Mnemonic::new_random(MasterKeyEntropy::Sufficient);
    let mnemonic = result.unwrap();
    mnemonic.to_string()
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
