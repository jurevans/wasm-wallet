import { MasterAccount } from 'types';

export interface AppState {
  masterAccount: MasterAccount;
  showMnemonic: boolean;
}

export const initialState: AppState = {
  masterAccount: null,
  showMnemonic: false,
};
