import React, {
  FC,
  ReactElement,
  useEffect,
  useCallback,
  useState,
} from 'react';
import styled from 'styled-components';
import Button from './components/Button';
import Mnemonic from './components/Mnemonic';

const Wrapper = styled.div`
  background: #222;
  color: #ddd;
  font-family: Arial, Helvetica, sans-serif;
  min-width: 400px;
  min-height: 500px;
  padding: 20px;
`;

const Heading = styled.h1`
  font-size: 18px;
`;

const port = chrome.runtime.connect({ name: 'intercom' });

const App: FC = (): ReactElement => {
  const [healthCheck, setHealthCheck] = useState({
    isConnected: false,
  });
  const [wordList, setMnemonic] = useState([]);

  useEffect(() => {
    port.postMessage({
      type: 'ping',
    });

    port.onMessage.addListener(({ type, response }) => {
      switch (type) {
        case 'healthcheck':
          setHealthCheck({
            isConnected: response,
          });
          break;
        case 'mnemonic':
          setMnemonic(response);
          break;
        default:
          console.log(type, response);
      }
    });
  }, []);

  const handleGenerateMnemonicClick = useCallback(() => {
    port.postMessage({
      type: 'generate_mnemonic',
    });
  }, []);

  return (
    <Wrapper>
      <Heading>Manage Keys</Heading>
      {wordList && wordList.length > 0 && (
        <div>
          <Mnemonic className={'popup-mnemonic'} wordList={wordList} />
          <p>
            Copy these to a safe place in order to restore your account should
            your wallet be corrupted or lost.
          </p>
        </div>
      )}
      <div>
        <Button
          className={'popup-generate-mnemonic'}
          onClick={handleGenerateMnemonicClick}
        >
          Generate Mnemonic
        </Button>
      </div>
      {healthCheck.isConnected && <p>Connected to service worker.</p>}
    </Wrapper>
  );
};

export default React.memo(App);
