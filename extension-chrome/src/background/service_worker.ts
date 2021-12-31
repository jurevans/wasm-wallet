import wasm from '../../pkg';

chrome.runtime.onInstalled.addListener(async () => {
  const { loaded_message } = await wasm;
  loaded_message();
  console.log('background listener: Extension installed successfully!');
});

chrome.runtime.onConnect.addListener(async (port) => {
  const { Wallet } = await wasm;
  const wallet = Wallet.new();

  if (port.name === 'walkietalkie') {
    port.onMessage.addListener((msg) => {
      const { type, data } = msg;
      switch (type) {
        case 'check':
          wallet.set_address('TEST_ADDRESS');
          console.log({ address: wallet.get_address() });
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
