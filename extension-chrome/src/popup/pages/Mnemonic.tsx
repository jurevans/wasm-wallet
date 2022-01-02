import React, {
  FC,
  useContext,
  useCallback,
  useState,
  ReactElement,
} from 'react';
import styled from 'styled-components';
import { AppContext } from 'state/context';
import Mnemonic from 'popup/components/Mnemonic';
import Button from 'popup/components/Button';
import { ActionType } from 'state/actions';

interface Props {
  className?: string;
}

const MnemonicPageBase: FC<Props> = ({ className }): ReactElement => {
  const { dispatch, state } = useContext(AppContext);
  const [checked, setChecked] = useState(false);
  const { mnemonic = '' } = state.masterAccount?.mnemonic || {};
  const wordList = mnemonic.split(' ');

  const handleCheckboxClick = useCallback(() => {
    setChecked(!checked);
  }, [checked]);

  const handleSubmit = useCallback(() => {
    dispatch({
      type: ActionType.SetShowMnemonic,
      payload: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  return (
    <div className={className}>
      <Mnemonic className={'popup-mnemonic'} wordList={wordList} />
      <label>
        <input
          type="checkbox"
          onClick={handleCheckboxClick}
          checked={checked}
        />
        I have copied the mnemonic above
      </label>
      {checked && <Button onClick={handleSubmit}>Continue</Button>}
    </div>
  );
};

export default React.memo(styled(MnemonicPageBase)`
  padding: 20px;
`);
