# WASM Wallet

This project is intended to be a browser-extension front-end (TypeScript, React) to [rust-wallet](https://github.com/rust-bitcoin/rust-wallet), which will run in WebAssembly. See the [notes](#notes) below regarding some issues using `rust-wallet` in conjunction with `wasm-bindgen`. The client (browser extension popup and options pages) communicate with the WASM via a service-worker, with the port being shared to components via the context API. _This is very much a work in progress!_

At some point it would be nice to see a cross-browser version of the extension, and if nothing else, additional versions of the Chrome extension for other browsers if cross-compatibility is too much of a headache.

**NOTE** This is absolutely _not_ for any production use cases at this time.

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
# Build only wasm:
wasm-pack build --out-dir ../extension-chrome/pkg --out-name index
```

Making changes in the Rust code can break the build for the TypeScript code as it needs the definitions to be updated in `extension-chrome/pkg` before it will build.

## NOTES

The version of [rust-wallet](https://github.com/jurevans/rust-wallet/) being utilized refers to a fork which addresses two `Cargo.toml` dependencies that need to be updated in order to work with `wasm-bindgen`, specifically:

`rand = "0.7"`, which is now:

```toml
rand = { version = "0.7", features = ["wasm-bindgen"] }
```

`rust-crypto`, which is now:

```toml
rust-crypto-wasm = { git = "https://github.com/buttercup/rust-crypto-wasm", rev = "2631030" }
```

See the [rust-crypto-wasm](https://github.com/buttercup/rust-crypto-wasm)

_More to come..._
