import React, {
  FC,
  ReactElement,
  useEffect,
  useCallback,
  useState,
} from 'react';
import styled from 'styled-components';

const Button = styled.a`
  cursor: pointer;
  padding: 10px 16px;
  color: #000;
  background: #ddd;
`;

const Wrapper = styled.div`
  background: #222;
  color: #ddd;
  font-family: Arial, Helvetica, sans-serif;
  min-width: 400px;
  min-height: 500px;
  padding: 20px;
`;

const port = chrome.runtime.connect({ name: 'walkietalkie' });

const App: FC = (): ReactElement => {
  const [healthCheck, setHealthCheck] = useState({
    isConnected: false,
    response: '',
  });

  const handleClick = useCallback(() => {
    port.postMessage({
      type: 'check',
      data: { check: 'Is everything okay?' },
    });
  }, []);

  useEffect(() => {
    port.onMessage.addListener(({ type, response }) => {
      switch (type) {
        case 'response':
          setHealthCheck({
            isConnected: true,
            response,
          });
        default:
          console.log(type, response);
      }
    });
  }, []);

  return (
    <Wrapper>
      <p>Future home of WASM Wallet Chrome-Extension</p>
      {healthCheck.isConnected && <p>{healthCheck.response}</p>}
      <div>
        <Button onClick={handleClick}>Health Check</Button>
      </div>
    </Wrapper>
  );
};

export default React.memo(App);
