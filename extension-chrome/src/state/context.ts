import React from 'react';
import { Actions } from './actions';
import { AppState, initialState } from './state';

export const AppContext = React.createContext<{
  state: AppState;
  dispatch: React.Dispatch<Actions>;
  port: chrome.runtime.Port;
}>({
  state: initialState,
  dispatch: () => undefined,
  port: null,
});
