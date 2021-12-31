import React, { FC, useReducer } from 'react';
import styled from 'styled-components';
import { AppContext } from 'state/context';
import reducer from 'state/reducer';
import { initialState } from 'state/state';

const port = chrome.runtime.connect({ name: 'intercom' });

const OptionsBase: FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch, port }}>
      <div>Options page placeholder</div>
    </AppContext.Provider>
  );
};

export default React.memo(styled(OptionsBase)`
  font-size: 12px;
`);
