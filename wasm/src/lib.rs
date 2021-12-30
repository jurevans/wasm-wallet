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
struct Wallet {
  passphrase: String,
}

#[wasm_bindgen]
impl Wallet {
    pub fn loaded_message() {
        console_log!("WASM has been successfully loaded!")
    }
}
