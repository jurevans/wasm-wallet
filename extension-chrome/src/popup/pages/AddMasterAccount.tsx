import React, {
  FC,
  ReactElement,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import Input from 'popup/components/Input';
import Button from 'popup/components/Button';
import styled from 'styled-components';
import Mnemonic from 'popup/components/Mnemonic';
import { AppContext } from 'state/context';

interface Props {
  className?: string;
}

const AddMasterAccountBase: FC<Props> = ({ className }): ReactElement => {
  const [wordList, setMnemonic] = useState([]);
  const { port } = useContext(AppContext);

  useEffect(() => {
    port.onMessage.addListener(({ type, response }) => {
      if (type === 'mnemonic') {
        setMnemonic(response);
      }
    });
  }, [port.onMessage]);

  const handleGenerateMnemonicClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      port.postMessage({
        type: 'generate_mnemonic',
      });
    },
    [port],
  );

  return (
    <div className={className}>
      <h1>Add Master Account</h1>
      {wordList.length > 0 && (
        <div>
          <Mnemonic className={'popup-mnemonic'} wordList={wordList} />
          <p>
            Copy these to a safe place in order to restore your account should
            your wallet be corrupted or lost.
          </p>
        </div>
      )}

      <form>
        <Input type="password" />
        <Input type="password" />
        <Button>Create</Button>
        <div>
          <Button
            className={'popup-generate-mnemonic'}
            onClick={handleGenerateMnemonicClick}
          >
            Generate Mnemonic
          </Button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(styled(AddMasterAccountBase)`
  padding: 20px;
`);
