// See: https://developer.chrome.com/docs/extensions/mv2/background_pages/.
type WalletType = typeof import('../../../wasm/pkg');

const loadWallet = (): Promise<WalletType> => {
  return import('../../../wasm/pkg');
};

chrome.runtime.onInstalled.addListener(() => {
  console.log('background listener: Extension installed successfully!');
  (async () => {
    const module = await loadWallet();
    console.log({ module });
  })();
});

export default {};
