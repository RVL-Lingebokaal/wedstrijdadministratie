'use client';
import { getParticipantForm, Team, WedstrijdIdProps } from '@models';
import { useCallback, useMemo, useState } from 'react';
import { Button, FormModal, Select } from '@components/server';
import { useForm } from 'react-hook-form';
import { TeamForm } from '../../../molecules/team-form/teamForm';
import { addTeamSchema, TeamAddForm } from '@schemas';
import { useUpdateTeam } from '@hooks';
import { zodResolver } from '@hookform/resolvers/zod';

interface TeamChangeButtonProps extends WedstrijdIdProps {
  teams: Team[];
}

export function TeamUpdateButton({
  wedstrijdId,
  teams,
}: TeamChangeButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [team, setTeam] = useState<null | Team>(null);
  const [_, setError] = useState<null | string>(null);
  const { mutate } = useUpdateTeam({ wedstrijdId });
  const teamsMap = useMemo(
    () =>
      teams.reduce<Map<string, Team>>((acc, t) => acc.set(t.id, t), new Map()),
    [teams]
  );
  const onClick = useCallback(() => setShowModal(true), []);
  const { getValues, control, handleSubmit, watch, reset, setValue } =
    useForm<TeamAddForm>({
      defaultValues: getTeamFormValues(),
      resolver: zodResolver(addTeamSchema),
    });

  const onClickSubmit = useCallback(
    async (val: TeamAddForm) => {
      mutate({ teamId: team?.id ?? '', ...val });
    },
    [mutate, team]
  );

  return (
    <>
      {showModal && (
        <FormModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit(onClickSubmit)}
          title="Wijzig een team"
          panelClassNames="max-w-xl"
        >
          <Select
            selectedValue={team ? team.id : ''}
            items={[
              { id: '', text: 'Kies een team', disabled: true },
              ...teams.map((t) => ({ id: t.id, text: `${t.id} - ${t.name}` })),
            ]}
            onChange={(val) => {
              const selectedTeam = teamsMap.get(val);
              if (selectedTeam) {
                setTeam(selectedTeam);
                reset(getTeamFormValues(selectedTeam));
              }
            }}
          />
          <TeamForm
            control={control}
            watch={watch}
            getValues={getValues}
            setError={setError}
            isUpdate
            setValue={setValue}
          />
        </FormModal>
      )}
      <Button name="Wijzig team" color="primary" onClick={onClick} />
    </>
  );
}

function getTeamFormValues(team?: Team): TeamAddForm {
  return {
    name: team?.name ?? '',
    club: team?.club ?? '',
    participants: team?.participants.map((p) => getParticipantForm(p)) ?? [],
    helm: team?.helm ? getParticipantForm(team.helm) : null,
    boat: team?.boat?.name ?? '',
    preferredBlock: team?.preferredBlock ?? 1,
    boatType: team?.boatType ?? '1x',
    gender: team?.gender ?? 'mix',
    unsubscribed: team?.unsubscribed ?? false,
  };
}
