import React, {
  FC,
  ReactElement,
  useEffect,
  useState,
  useReducer,
} from 'react';
import styled from 'styled-components';
import reducer from 'state/reducer';
import AddMasterAccount from './pages/AddMasterAccount';
import Accounts from './pages/Accounts';
import { initialState } from 'state/state';
import { AppContext } from 'state/context';

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

const Popup: FC = (): ReactElement => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { masterAccount } = state;

  const [healthCheck, setHealthCheck] = useState({
    isConnected: false,
  });

  useEffect(() => {
    port.postMessage({
      type: 'ping',
    });

    port.onMessage.addListener(({ type, response }) => {
      if (type === 'healthcheck') {
        setHealthCheck({
          isConnected: response,
        });
      }
    });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, port }}>
      <Wrapper>
        <Heading>Manage Keys</Heading>
        {/* TODO: Switch following to !masterAccount */}
        {masterAccount && <AddMasterAccount />}
        {masterAccount && <Accounts />}
        {healthCheck.isConnected && <p>Connected to service worker.</p>}
      </Wrapper>
    </AppContext.Provider>
  );
};

export default React.memo(Popup);
