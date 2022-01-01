import { Account, MasterAccount } from './state';

export enum ActionType {
  GetMasterAccount,
  SetMasterAccount,
  GetAccounts,
  AddAccount,
  RemoveAccount,
}

export interface GetMasterAccount {
  type: ActionType.GetMasterAccount;
  payload: MasterAccount;
}

export interface SetMasterAccount {
  type: ActionType.SetMasterAccount;
  payload: MasterAccount;
}

export interface GetAccounts {
  type: ActionType.GetAccounts;
  payload: null;
}

export interface AddAccount {
  type: ActionType.AddAccount;
  payload: Account;
}

export interface RemoveAccount {
  type: ActionType.RemoveAccount;
  payload: number;
}

export type Actions =
  | GetMasterAccount
  | SetMasterAccount
  | GetAccounts
  | AddAccount
  | RemoveAccount;
