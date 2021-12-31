export interface Account {
  id: number;
  address: string;
}

export interface MasterAccount {
  publicKey: string;
  accounts: Account[];
}

export interface AppState {
  masterAccount: MasterAccount;
}

export const initialState: AppState = {
  masterAccount: {
    publicKey: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    accounts: [
      {
        id: 1,
        address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', // P2PKH
      },
      {
        id: 2,
        address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy', // P2SH
      },
      {
        id: 3,
        address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', // Bech32
      },
    ],
  },
};
