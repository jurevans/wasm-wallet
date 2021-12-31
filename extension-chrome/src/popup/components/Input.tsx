import React, { FC, FormEvent, ReactElement } from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  type?: string;
  value?: string;
  onChange: (e: FormEvent<HTMLInputElement>) => void;
}

const InputBase: FC<Props> = ({
  className,
  type = 'text',
  value = '',
  onChange,
}): ReactElement => {
  return (
    <input
      type={type}
      className={className}
      value={value}
      onChange={onChange}
    />
  );
};

export default React.memo(styled(InputBase)`
  font-size: 14px;
`);
