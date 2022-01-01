import React, {
  FC,
  ReactElement,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useForm } from 'react-hook-form';
import Button from 'popup/components/Button';
import styled from 'styled-components';
import Mnemonic from 'popup/components/Mnemonic';
import { AppContext } from 'state/context';
import { Levels } from 'types';

interface Props {
  className?: string;
}

const AddMasterAccountBase: FC<Props> = ({ className }): ReactElement => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      passphrase: '',
      confirmPassphrase: '',
    },
    criteriaMode: 'all',
  });

  const [masterAccount, setMasterAccount] = useState({
    level: 16,
    mnemonic: '',
  });
  const [level, setLevel] = useState(Levels.Sufficient);
  const { port } = useContext(AppContext);

  const { mnemonic } = masterAccount || {};
  const wordList = mnemonic ? mnemonic.split(' ') : [];

  useEffect(() => {
    port.onMessage.addListener(({ type, response }) => {
      if (type === 'create_master_account') {
        setMasterAccount(response);
      }
    });
  }, [port.onMessage]);

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

  const onSubmit = (formValues: any): void => {
    const { passphrase } = formValues;
    port.postMessage({
      type: 'create_master_account',
      data: {
        passphrase,
        level,
      },
    });
  };

  const Select = styled.select`
    display: block;
  `;

  const Label = styled.label`
    display: block;
  `;

  const options = {
    required: true,
    validate: {
      minLength: (value: string) => value.length >= 8,
    },
  };

  const validatePassphrase = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: 'passphrase' | 'confirmPassphrase',
  ): void => {
    const { value } = e.target;
    if (value.length >= 8) {
      clearErrors(name);
    } else {
      if (value.length > 0) {
        setError(name, {
          types: {
            minLength: 'Must be at least 8 characters!',
          },
        });
      } else {
        setError(name, {
          types: {
            required: 'Password is required!',
          },
        });
      }
    }
  };

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

      <form onSubmit={handleSubmit(onSubmit)}>
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

        <Label>Enter passphrase:</Label>
        <input
          type="password"
          {...register('passphrase', options)}
          onChange={(e) => {
            validatePassphrase(e, 'passphrase');
          }}
        />
        {<p>{errors.passphrase?.types?.minLength}</p>}
        {<p>{errors.passphrase?.types?.required}</p>}

        <Label>Confirm passphrase:</Label>
        <input
          type="password"
          {...register('confirmPassphrase', options)}
          onChange={(e) => {
            validatePassphrase(e, 'confirmPassphrase');
          }}
        />
        {<p>{errors.confirmPassphrase?.types?.minLength}</p>}
        {<p>{errors.confirmPassphrase?.types?.required}</p>}

        <div>
          <Button className={'btn-create-master-account'}>Create</Button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(styled(AddMasterAccountBase)`
  padding: 20px;
`);
