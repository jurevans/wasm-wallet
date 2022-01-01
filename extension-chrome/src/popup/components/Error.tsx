import React, { FC } from 'react';
import styled from 'styled-components';

interface Props {
  message: string;
  className?: string;
}

const ErrorBase: FC<Props> = ({ message, className = '' }) => {
  return <div className={className}>{message}</div>;
};

export default React.memo(styled(ErrorBase)`
  color: #cc0000;
  font-weight: bold;
`);
