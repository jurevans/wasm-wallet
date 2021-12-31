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
import { Levels } from 'types';

interface Props {
  className?: string;
}

const AddMasterAccountBase: FC<Props> = ({ className }): ReactElement => {
  const [wordList, setMnemonic] = useState([]);
  const [level, setLevel] = useState(Levels.Sufficient);
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
        data: {
          level,
        },
      });
    },
    [port, level],
  );

  const handleLevelChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = e.target;
      switch (parseInt(value)) {
        case Levels.Sufficient:
          setLevel(Levels.Sufficient);
          break;
        case Levels.Double:
          setLevel(Levels.Double);
          break;
        case Levels.Paranoid:
          setLevel(Levels.Paranoid);
          break;
        default:
          setLevel(Levels.Sufficient);
      }
    },
    [],
  );

  const Select = styled.select`
    display: block;
  `;

  const Label = styled.label`
    display: block;
  `;

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
        <Label>
          Select security level:
          <Select onChange={handleLevelChange}>
            <option value="16" selected={level === Levels.Sufficient}>
              Sufficient
            </option>
            <option value="32" selected={level === Levels.Double}>
              Double
            </option>
            <option value="64" selected={level === Levels.Paranoid}>
              Paranoid
            </option>
          </Select>
        </Label>

        <Label>
          Enter passphrase:
          <Input type="password" />
        </Label>

        <Label>
          Confirm passphrase:
          <Input type="password" />
        </Label>

        <div>
          <Button
            className={'btn-create-master-account'}
            onClick={handleGenerateMnemonicClick}
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(styled(AddMasterAccountBase)`
  padding: 20px;
`);
