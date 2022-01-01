import React, {
  FC,
  ReactElement,
  useContext,
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import { useForm } from 'react-hook-form';
import Button from 'popup/components/Button';
import styled from 'styled-components';
import Mnemonic from 'popup/components/Mnemonic';
import { AppContext } from 'state/context';
import { Levels, LevelType } from 'types';
import Select from 'popup/components/Select';
import Error from 'popup/components/Error';

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
    level: Levels.Sufficient,
    mnemonic: '',
  });
  const [level, setLevel]: [LevelType, Dispatch<SetStateAction<Levels>>] =
    useState(Levels.Sufficient);
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
      console.log({ value });
      setLevel(parseInt(value));
    },
    [],
  );

  const onSubmit = (formValues: any): void => {
    const { passphrase, confirmPassphrase } = formValues;

    if (passphrase !== confirmPassphrase) {
      setError('confirmPassphrase', {
        types: {
          passphraseMismatch: 'Passwords do not match!',
        },
      });
    } else {
      clearErrors('confirmPassphrase');
      port.postMessage({
        type: 'create_master_account',
        data: {
          passphrase,
          level,
        },
      });
    }
  };

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
        <div>
          <label>Select security level:</label>
          <Select<LevelType>
            onChange={handleLevelChange}
            selectedValue={level}
            options={[
              {
                label: 'Sufficient',
                value: Levels.Sufficient,
              },
              {
                label: 'Double',
                value: Levels.Double,
              },
              {
                label: 'Paranoid',
                value: Levels.Paranoid,
              },
            ]}
          />
        </div>

        <div>
          <label>Enter passphrase:</label>
          <input
            type="password"
            {...register('passphrase', options)}
            onChange={(e) => {
              validatePassphrase(e, 'passphrase');
            }}
          />
          <Error message={errors.passphrase?.types?.minLength} />
          <Error message={errors.passphrase?.types?.required} />
        </div>

        <div>
          <label>Confirm passphrase:</label>
          <input
            type="password"
            {...register('confirmPassphrase', options)}
            onChange={(e) => {
              validatePassphrase(e, 'confirmPassphrase');
            }}
          />
          <Error message={errors.confirmPassphrase?.types?.minLength} />
          <Error message={errors.confirmPassphrase?.types?.required} />
          <Error
            message={errors.confirmPassphrase?.types?.passphraseMismatch}
          />
        </div>

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
