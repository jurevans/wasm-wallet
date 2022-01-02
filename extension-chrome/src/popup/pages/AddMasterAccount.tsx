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
import styled from 'styled-components';
import { AppContext } from 'state/context';
import { ActionType } from 'state/actions';
import { Levels, LevelType } from 'types';
import Button from 'popup/components/Button';
import Select from 'popup/components/Select';
import Error from 'popup/components/Error';

interface Props {
  className?: string;
}

const AddMasterAccountPageBase: FC<Props> = ({ className }): ReactElement => {
  const [level, setLevel]: [LevelType, Dispatch<SetStateAction<Levels>>] =
    useState(Levels.Sufficient);
  const { port, dispatch } = useContext(AppContext);

  // Setup form validation
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

  // Update state when receiving a message from service worker
  useEffect(() => {
    port.onMessage.addListener(({ type, response }) => {
      if (type === 'create_master_account') {
        dispatch({
          type: ActionType.SetMasterAccount,
          payload: response,
        });
      }
    });
  }, [dispatch, port.onMessage, setError]);

  const handleLevelChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = e.target;
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
      dispatch({
        type: ActionType.SetShowMnemonic,
        payload: true,
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

export default React.memo(styled(AddMasterAccountPageBase)`
  padding: 20px;
`);
