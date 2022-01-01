import React, { FC, ReactElement } from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  wordList: string[];
}

const MnemonicBase: FC<Props> = ({ className, wordList }): ReactElement => {
  return (
    <div className={className}>
      {wordList.map((word, i) => (
        <span className="mnemonic-word" key={i}>
          {word}
        </span>
      ))}
    </div>
  );
};

export default React.memo(styled(MnemonicBase)`
  padding: 0 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background: #fff;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  & > .mnemonic-word {
    flex: 1 0 21%;
    padding: 16px 0;
  }
`);
