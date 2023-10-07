import { Gender, Team } from "../../../../models/team";
import { useCallback, useMemo, useState } from "react";
import { Button } from "../../../atoms/button/button";
import FormModal from "../../../atoms/form-modal/formModal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TeamAddForm } from "../team-add-button/teamAddButton";
import { BoatType } from "../../../../models/settings";
import TeamForm from "../../../molecules/team-form/teamForm";
import { Select } from "../../../atoms/select/select";
import { addTeamSchema } from "../../../../schemas/addTeamSchema";
import { useUpdateTeam } from "../../../../hooks/teams/useUpdateTeam";

interface TeamChangeButtonProps {
  refetch: () => void;
  teams: Team[];
}

export function TeamUpdateButton({ refetch, teams }: TeamChangeButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [team, setTeam] = useState<null | Team>(null);
  const [error, setError] = useState<null | string>(null);
  const { mutate } = useUpdateTeam();
  const teamsMap = useMemo(
    () =>
      teams.reduce<Map<string, Team>>(
        (acc, t) => acc.set(t.getId(), t),
        new Map()
      ),
    [teams]
  );
  const onClick = useCallback(() => setShowModal(true), []);
  const { formState, getValues, control, handleSubmit, watch, reset } =
    useForm<TeamAddForm>({
      defaultValues: getTeamFormValues(),
      resolver: yupResolver(addTeamSchema),
    });

  const onClickSubmit = useCallback(
    async (val: TeamAddForm) => {
      const dirtyFields = formState.dirtyFields;
      const updatedObject = Object.keys(dirtyFields).reduce<
        Record<string, any>
      >((obj, key) => {
        obj[key] = val[key as keyof TeamAddForm];
        return obj;
      }, {}) as Partial<TeamAddForm>;
      mutate({ teamId: team?.getId() ?? "", ...updatedObject });
      refetch();
    },
    [formState.dirtyFields, mutate, refetch, team]
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
            selectedValue={team ? team.getId().toString() : ""}
            items={[
              { id: "", text: "Kies een team", disabled: true },
              ...teams.map((t) => ({ id: t.getId(), text: t.getNameAndId() })),
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
          />
        </FormModal>
      )}
      <Button name="Wijzig team" color="primary" onClick={onClick} />
    </>
  );
}

function getTeamFormValues(team?: Team): TeamAddForm {
  return {
    name: team?.getName() ?? "",
    club: team?.getClub() ?? "",
    participants:
      team?.getParticipants().map((p) => p.getParticipantForm()) ?? [],
    helm: team?.getHelm()?.getParticipantForm() ?? null,
    boat: team?.getBoat()?.getName() ?? "",
    preferredBlock: team?.getPreferredBlock() ?? 1,
    boatType: team?.getBoatType() ?? BoatType.skiff,
    gender: team?.getGender() ?? Gender.MIX,
  };
}
