'use client';
import {
  Button,
  IconButton,
  InputController,
  SelectController,
} from '@components/server';
import { BoatType, boatTypes } from '@models';
import { AddParticipantForm } from '../add-participant-form/addParticipantForm';
import { FaTrashAlt } from 'react-icons/fa';
import { getDisabled } from '../../organisms/team/team-add-button/teamAddButton';
import {
  Control,
  useFieldArray,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { useCallback, useState } from 'react';
import { TeamAddForm } from '@schemas';
import { CheckboxController } from '../checkbox/checkboxController';

interface TeamFormProps {
  control: Control<TeamAddForm>;
  watch: UseFormWatch<TeamAddForm>;
  getValues: UseFormGetValues<TeamAddForm>;
  setError: (val: string | null) => void;
  isUpdate?: boolean;
  setValue: UseFormSetValue<TeamAddForm>;
}

export function TeamForm({
  control,
  watch,
  getValues,
  setError,
  isUpdate,
  setValue,
}: TeamFormProps) {
  const [showAddParticipant, setShowAddParticipant] = useState(false);

  const watchedBoatType = watch('boatType');
  const club = watch('club');
  const { fields, append, remove } = useFieldArray<TeamAddForm>({
    control,
    name: 'participants',
  });

  const onClick = useCallback(
    (val: TeamAddForm['participants'][0], index: number) => {
      remove(index);
      append(val);
      setShowAddParticipant(false);
    },
    [append, remove]
  );

  return (
    <>
      <div className="flex gap-x-3">
        <SelectController<TeamAddForm, BoatType>
          path="boatType"
          control={control}
          label="Boottype"
          topClassNames="grow"
          items={boatTypes.map((val) => ({ id: val }))}
          disabled={isUpdate}
          onSelect={(val) =>
            checkNeedsHelm(val as BoatType) && !isUpdate
              ? setValue('helm', { club: '', birthYear: '1900', name: '' })
              : undefined
          }
        />
        <SelectController<TeamAddForm, number>
          path="preferredBlock"
          control={control}
          label="Voorkeursblok"
          topClassNames="grow"
          items={[{ id: 1 }, { id: 2 }, { id: 3 }]}
          disabled={isUpdate}
        />
        <SelectController
          path="gender"
          control={control}
          label="Geslacht"
          topClassNames="grow"
          isGender
        />
        {isUpdate && (
          <CheckboxController<TeamAddForm>
            path="unsubscribed"
            control={control}
            label="Uitgeschreven"
          />
        )}
      </div>
      <div className="flex gap-x-3">
        <InputController
          disabled={isUpdate}
          path="name"
          control={control}
          label="Teamnaam"
        />
        <InputController path="club" control={control} label="Vereniging" />
        <InputController path="boat" control={control} label="Bootnaam" />
      </div>
      {checkNeedsHelm(watchedBoatType) && (
        <div className="flex gap-x-3">
          <InputController
            path="helm.name"
            control={control}
            label="Naam stuur"
            onChange={() => setValue('helm.id', undefined)}
          />
          <InputController
            path="helm.club"
            control={control}
            label="Vereniging stuur"
            onChange={() => setValue('helm.id', undefined)}
          />
          <InputController
            path="helm.birthYear"
            control={control}
            label="Geboortejaar stuur"
            onChange={() => setValue('helm.id', undefined)}
          />
        </div>
      )}
      {!isUpdate && (
        <Button
          name="Voeg deelnemer toe"
          color="primary"
          disabled={
            showAddParticipant || getDisabled(watchedBoatType, fields.length)
          }
          onClick={() => {
            setShowAddParticipant(true);
            append({ name: '', club, birthYear: '1900' });
            setError(null);
          }}
          classNames="my-3"
        />
      )}
      {showAddParticipant && !isUpdate && (
        <AddParticipantForm
          addParticipant={onClick}
          index={getValues('participants').length - 1}
        />
      )}
      {fields.map((field, index) =>
        field.name ? (
          <div key={field.id} className="grid grid-cols-3 gap-x-3">
            <div>
              {isUpdate ? (
                <InputController<TeamAddForm>
                  path={`participants.${index}.name`}
                  control={control}
                  onChange={() =>
                    setValue(`participants.${index}.id`, undefined)
                  }
                />
              ) : (
                <>
                  <IconButton
                    icon={<FaTrashAlt />}
                    onClick={() => remove(index)}
                    classNames="mr-2"
                  />
                  {index + 1}. {field.name}
                </>
              )}
            </div>
            {isUpdate ? (
              <InputController<TeamAddForm>
                path={`participants.${index}.club`}
                control={control}
                onChange={() => setValue(`participants.${index}.id`, undefined)}
              />
            ) : (
              <div>{field.club}</div>
            )}
            {isUpdate ? (
              <InputController<TeamAddForm>
                path={`participants.${index}.birthYear`}
                control={control}
                onChange={() => setValue(`participants.${index}.id`, undefined)}
              />
            ) : (
              <div>{field.birthYear}</div>
            )}
          </div>
        ) : undefined
      )}
    </>
  );
}

function checkNeedsHelm(val: BoatType) {
  return val !== '1x' && val !== '2-' && val !== '2x';
}
