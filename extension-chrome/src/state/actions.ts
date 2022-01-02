import { Account, MasterAccount } from 'types';

export enum ActionType {
  SetMasterAccount,
  AddAccount,
  RemoveAccount,
  SetShowMnemonic,
}

export interface SetMasterAccount {
  type: ActionType.SetMasterAccount;
  payload: MasterAccount;
}

export interface AddAccount {
  type: ActionType.AddAccount;
  payload: Account;
}

export interface RemoveAccount {
  type: ActionType.RemoveAccount;
  payload: number;
}

export interface SetShowMnemonic {
  type: ActionType.SetShowMnemonic;
  payload: boolean;
}

export type Actions =
  | SetMasterAccount
  | AddAccount
  | RemoveAccount
  | SetShowMnemonic;
