import React, { FC, ReactElement, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  className?: string;
  onClick: () => void;
}

const ButtonBase: FC<Props> = ({
  children,
  className,
  onClick,
}): ReactElement => {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default React.memo(styled(ButtonBase)`
  padding: 10px 16px;
  color: #000;
  background: #ddd;
`);
