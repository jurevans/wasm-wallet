# WASM Wallet

**NOTE** This is absolutely not for any production use cases at this time.

## Chrome extension

In `./extension-chrome`:

```bash
# Dev mode:
yarn start

# Build:
yarn build
```

You can build only the WASM (e.g., if you want to update the TypeScript definitions to use for new updates in the `extension-chrome` app after making changes in Rust, before executing `yarn build` again), using the following from within the `./wasm` directory:

```bash
wasm-pack build --out-dir ../extension-chrome/pkg --out-name index
```

Making changes in the Rust code can break the build for the TypeScript code as it needs the definitions to be updated in `extension-chrome/pkg` before it will build.

**NOTE**: The version of [rust-wallet](https://github.com/jurevans/rust-wallet/) being utilized refers to a fork which addresses two `Cargo.toml` dependencies that need to be updated in order to work with `wasm-bindgen`, specifically:

- `rand = "0.7"`, which is now `rand = { version = "0.7", features = ["wasm-bindgen"] }`
- `rust-crypto`, which is now `rust-crypto-wasm = { git = "https://github.com/buttercup/rust-crypto-wasm", rev = "2631030" }`

See the [rust-crypto-wasm](https://github.com/buttercup/rust-crypto-wasm)

_More to come..._
