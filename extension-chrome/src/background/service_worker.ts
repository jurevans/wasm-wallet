import wasm from '../../pkg';

chrome.runtime.onInstalled.addListener(async () => {
  console.log('background listener: Extension installed successfully!');
});

chrome.runtime.onConnect.addListener(async (port) => {
  if (port.name === 'walkietalkie') {
    const { Wallet } = await wasm;
    Wallet.loaded_message();
    port.onMessage.addListener((msg) => {
      const { type, data } = msg;
      switch (type) {
        case 'check':
          console.info({ message: data.check });
          port.postMessage({
            type: 'response',
            response: 'Everything is fine!',
          });
          break;
        default:
          console.log({ msg });
      }
    });
  }
});

export default {};
