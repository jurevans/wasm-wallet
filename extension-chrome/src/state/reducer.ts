import { Actions, ActionType } from './actions';
import { AppState } from './state';
import { Account } from 'types';

export default (state: AppState, action: Actions): AppState => {
  switch (action.type) {
    case ActionType.SetMasterAccount:
      return {
        ...state,
        masterAccount: action.payload,
      };
    case ActionType.AddAccount:
      const { accounts } = state.masterAccount;
      accounts.push(action.payload);
      return {
        ...state,
        masterAccount: {
          ...state.masterAccount,
          accounts,
        },
      };
    case ActionType.RemoveAccount:
      return {
        ...state,
        masterAccount: {
          ...state.masterAccount,
          accounts: state.masterAccount.accounts.filter(
            (account: Account) => account.account_number !== action.payload,
          ),
        },
      };
    case ActionType.SetShowMnemonic:
      return {
        ...state,
        showMnemonic: action.payload,
      };
    default:
      return state;
  }
};
