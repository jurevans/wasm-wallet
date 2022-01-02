import wasm from '../../pkg';
import { Levels, MasterAccount } from 'types';

interface Data {
  passphrase?: string;
  level?: Levels;
}

const healthCheck = async (port: chrome.runtime.Port): Promise<void> => {
  const { health_check } = await wasm;
  port.postMessage({
    type: 'healthcheck',
    response: health_check(),
  });
};

const generateMasterAccount = async (
  port: chrome.runtime.Port,
  passphrase = '',
  level = 16,
): Promise<void> => {
  const { MasterAccountSerializable } = await wasm;
  const masterAccount: MasterAccount = MasterAccountSerializable.new(
    passphrase,
    level,
  );
  port.postMessage({
    type: 'create_master_account',
    response: masterAccount,
  });
};

chrome.runtime.onInstalled.addListener(async () => {
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
        case 'create_master_account':
          generateMasterAccount(port, data.passphrase, data.level);
          break;
        default:
          console.log({ type, data });
      }
    });
  }
});

export default {};
