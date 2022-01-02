import React, { FC, ReactElement, useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from 'state/context';
import Button from 'popup/components/Button';

interface Props {
  className?: string;
}

const AccountsPageBase: FC<Props> = ({ className }): ReactElement => {
  const { state } = useContext(AppContext);
  const { accounts } = state.masterAccount;

  return (
    <div className={className}>
      <h1>Accounts</h1>
      {accounts.length > 0 && (
        <ul>
          {accounts.map(({ account_number }) => (
            <li key={account_number}>{account_number}</li>
          ))}
        </ul>
      )}
      <Button>Add Account</Button>
    </div>
  );
};

export default React.memo(styled(AccountsPageBase)`
  padding: 20px;
`);
