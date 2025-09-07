'use client';
import { Button, FormModal } from '@components/server';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BoatType } from '@models';
import { addTeamSchema, TeamAddForm } from '@schemas';
import { useAddTeam } from '@hooks';
import { TeamForm } from '../../../molecules/team-form/teamForm';
import { zodResolver } from '@hookform/resolvers/zod';

interface TeamAddButtonProps {
  refetch: () => void;
}

export function TeamAddButton({ refetch }: TeamAddButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const methods = useForm<TeamAddForm>({
    resolver: zodResolver(addTeamSchema),
    defaultValues: getDefaultValues(),
    mode: 'onSubmit',
  });
  const [error, setError] = useState<string | null>(null);
  const { watch, control, getValues, handleSubmit, reset, setValue } = methods;
  const { mutate } = useAddTeam();
  const boatType = watch('boatType');

  const onClickSubmit = useCallback(
    async (val: TeamAddForm) => {
      if (!getDisabled(boatType, val.participants.length)) {
        setError(
          'Er missen nog deelnemers. Voeg meer deelnemers toe om de boot vol te krijgen.'
        );
        return;
      }
      mutate(val);
      refetch();
      reset(getDefaultValues());
      setShowModal(false);
    },
    [boatType, mutate, refetch, reset]
  );

  return (
    <>
      {showModal && (
        <FormModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit(onClickSubmit)}
          title="Team"
          description="Vul alle velden hieronder in om een team toe te voegen"
          panelClassNames="max-w-xl"
        >
          <FormProvider {...methods}>
            <TeamForm
              control={control}
              watch={watch}
              getValues={getValues}
              setError={(val) => setError(val)}
              setValue={setValue}
            />
            {error && <span className="text-red-600">{error}</span>}
          </FormProvider>
        </FormModal>
      )}
      <Button
        name="Voeg team toe"
        color="primary"
        onClick={() => setShowModal(true)}
      />
    </>
  );
}

function getDefaultValues(): TeamAddForm {
  return {
    name: '',
    club: '',
    participants: [],
    boat: '',
    preferredBlock: 1,
    boatType: '1x',
    helm: null,
    gender: 'male',
  };
}

export function getDisabled(type: BoatType, participantsLength: number) {
  switch (type) {
    case '1x':
      return participantsLength >= 1;
    case '2-':
    case '2x':
      return participantsLength >= 2;
    case '4-':
    case '4x-':
    case '4+':
    case '4*':
    case 'C4+':
    case 'C4*':
      return participantsLength >= 4;
    default:
      return participantsLength >= 8;
  }
}
