import wasm from '../../pkg';
import { Levels } from 'types';

interface Data {
  level?: Levels;
}

const healthCheck = async (port: chrome.runtime.Port): Promise<void> => {
  const { health_check } = await wasm;
  port.postMessage({
    type: 'healthcheck',
    response: health_check(),
  });
};

const getMnemonic = async (
  port: chrome.runtime.Port,
  level = 16,
): Promise<void> => {
  const { generate_mnemonic } = await wasm;
  const response = generate_mnemonic(level);
  port.postMessage({
    type: 'mnemonic',
    response: response && response.split(' '),
  });
};

chrome.runtime.onInstalled.addListener(async () => {
  const { loaded } = await wasm;
  loaded();
  console.log('background listener: Extension installed successfully!');
});

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'intercom') {
    port.onMessage.addListener(async (msg) => {
      const { type, data }: { type: string; data: Data } = msg;
      switch (type) {
        case 'ping':
          healthCheck(port);
          break;
        case 'generate_mnemonic':
          getMnemonic(port, data.level);
          break;
        default:
          console.log({ type, data });
      }
    });
  }
});

export default {};
