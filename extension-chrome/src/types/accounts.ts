export interface Mnemonic {
  type: number;
  mnemonic: string;
}

export interface Account {
  address_type: number;
  account_number: number;
  sub_account_number: number;
  look_ahead: number;
}

export interface MasterAccount {
  encrypted: number[];
  accounts: Account[];
  mnemonic: Mnemonic;
}

export interface ExtendedPublicKey {
  network: number;
  public_key: number;
  depth: number;
  parent_fingerprint: number;
  chain_code: number;
  child_number: number;
}
