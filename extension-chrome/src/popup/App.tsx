import React, { FC, ReactElement } from 'react';
import styled from 'styled-components';

const Button = styled.a`
  color: red;
`;

const Wrapper = styled.div`
  background: #222;
  color: #ddd;
  font-family: Arial, Helvetica, sans-serif;
`;

const App: FC = (): ReactElement => {
  return (
    <Wrapper>
      Future home of WASM Wallet Chrome-Extension <Button>TEST</Button>
    </Wrapper>
  );
};

export default React.memo(App);
