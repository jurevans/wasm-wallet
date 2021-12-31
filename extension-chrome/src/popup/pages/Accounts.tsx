import React, { FC, ReactElement, useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from 'state/context';

interface Props {
  className?: string;
}

const AccountsBase: FC<Props> = ({ className }): ReactElement => {
  const { state } = useContext(AppContext);
  const { accounts } = state.masterAccount;

  return (
    <div className={className}>
      <h1>Accounts</h1>
      {accounts.length > 0 && (
        <ul>
          {accounts.map(({ id, address }) => (
            <li key={id}>{address}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default React.memo(styled(AccountsBase)`
  padding: 20px;
`);
