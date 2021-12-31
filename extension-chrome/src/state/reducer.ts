import { Actions, ActionType } from './actions';
import { Account, AppState } from './state';

export default (state: AppState, action: Actions): AppState => {
  switch (action.type) {
    case ActionType.GetMasterAccount:
      return {
        ...state,
        ...action.payload,
      };
    case ActionType.SetMasterAccount:
      return {
        ...state,
        masterAccount: action.payload,
      };
    case ActionType.GetAccounts:
      return {
        ...state,
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
            (account: Account) => account.id !== action.payload,
          ),
        },
      };
  }

  return state;
};
